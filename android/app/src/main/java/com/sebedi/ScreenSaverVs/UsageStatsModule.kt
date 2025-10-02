package com.sebedi.ScreenSaverVs.usage

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.*
import java.util.Calendar

class UsageStatsModule(private val reactCtx: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactCtx) {

  override fun getName() = "UsageStats" // <-- JS module name

  @ReactMethod
  fun settingsAction(promise: Promise) {
    promise.resolve(Settings.ACTION_USAGE_ACCESS_SETTINGS)
  }

  @ReactMethod
  fun hasPermission(promise: Promise) {
    val appOps = reactCtx.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = appOps.unsafeCheckOpNoThrow(
      AppOpsManager.OPSTR_GET_USAGE_STATS,
      Process.myUid(),
      reactCtx.packageName
    )
    promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
  }

  @ReactMethod
  fun getTotalForegroundTime(startMs: Double, endMs: Double, promise: Promise) {
    try {
      val usm = reactCtx.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val stats: List<UsageStats> =
        usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startMs.toLong(), endMs.toLong())
          ?: emptyList()
      var total = 0L
      for (u in stats) total += u.totalTimeInForeground
      if (total == 0L) {
        total = estimateViaEvents(usm, startMs.toLong(), endMs.toLong())
      }
      promise.resolve(total.toDouble())
    } catch (e: Exception) {
      promise.reject("ERR_USAGE", e)
    }
  }

  @ReactMethod
  fun getPerAppForegroundTimes(startMs: Double, endMs: Double, promise: Promise) {
    try {
      val pm = reactCtx.packageManager
      val usm = reactCtx.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startMs.toLong(), endMs.toLong())
        ?: emptyList()

      val out: WritableArray = Arguments.createArray()
      for (u in stats) {
        val ms = u.totalTimeInForeground
        if (ms <= 0L) continue
        val pkg = u.packageName ?: continue
        val appName = try {
          val ai = pm.getApplicationInfo(pkg, 0)
          pm.getApplicationLabel(ai)?.toString() ?: pkg
        } catch (_: PackageManager.NameNotFoundException) { pkg }

        val m: WritableMap = Arguments.createMap()
        m.putString("packageName", pkg)
        m.putString("appName", appName)
        m.putDouble("ms", ms.toDouble())
        out.pushMap(m)
      }

      if (out.size() == 0) {
        val events = perAppViaEvents(usm, startMs.toLong(), endMs.toLong())
        for ((pkg, ms) in events) {
          val appName = try {
            val ai = pm.getApplicationInfo(pkg, 0)
            pm.getApplicationLabel(ai)?.toString() ?: pkg
          } catch (_: PackageManager.NameNotFoundException) { pkg }
          val m = Arguments.createMap()
          m.putString("packageName", pkg)
          m.putString("appName", appName)
          m.putDouble("ms", ms.toDouble())
          out.pushMap(m)
        }
      }
      promise.resolve(out)
    } catch (e: Exception) {
      promise.reject("ERR_USAGE", e)
    }
  }

  @ReactMethod
  fun getDailyTotals(days: Int, promise: Promise) {
    try {
      val usm = reactCtx.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val out = Arguments.createArray()

      // start from today 00:00 and go backwards (days-1)
      val cal = Calendar.getInstance()
      cal.set(Calendar.HOUR_OF_DAY, 0)
      cal.set(Calendar.MINUTE, 0)
      cal.set(Calendar.SECOND, 0)
      cal.set(Calendar.MILLISECOND, 0)

      for (i in (days - 1) downTo 0) {
        val start = (cal.timeInMillis - i * 24L * 60L * 60L * 1000L)
        val end = start + 24L * 60L * 60L * 1000L

        val stats: List<UsageStats> =
          usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end) ?: emptyList()

        var total = 0L
        for (u in stats) total += u.totalTimeInForeground
        if (total == 0L) {
          total = estimateViaEvents(usm, start, end)
        }

        // yyyy-MM-dd (device local)
        val dayCal = Calendar.getInstance().apply { timeInMillis = start }
        val y = dayCal.get(Calendar.YEAR)
        val m = (dayCal.get(Calendar.MONTH) + 1).toString().padStart(2, '0')
        val d = (dayCal.get(Calendar.DAY_OF_MONTH)).toString().padStart(2, '0')
        val label = "$y-$m-$d"

        val row = Arguments.createMap()
        row.putString("date", label)
        row.putDouble("ms", total.toDouble())
        out.pushMap(row)
      }

      promise.resolve(out)
    } catch (e: Exception) {
      promise.reject("ERR_DAILY_TOTALS", e)
    }
  }


  private fun estimateViaEvents(usm: UsageStatsManager, startMs: Long, endMs: Long): Long {
    val events = usm.queryEvents(startMs, endMs)
    val last = mutableMapOf<String, Long>()
    var total = 0L
    val e = UsageEvents.Event()
    while (events.hasNextEvent()) {
      events.getNextEvent(e)
      val pkg = e.packageName ?: continue
      when (e.eventType) {
        UsageEvents.Event.ACTIVITY_RESUMED, UsageEvents.Event.MOVE_TO_FOREGROUND -> {
          last[pkg] = e.timeStamp
        }
        UsageEvents.Event.ACTIVITY_PAUSED, UsageEvents.Event.MOVE_TO_BACKGROUND -> {
          val s = last.remove(pkg) ?: continue
          if (e.timeStamp > s) total += (e.timeStamp - s)
        }
      }
    }
    return total
  }

  private fun perAppViaEvents(usm: UsageStatsManager, startMs: Long, endMs: Long): Map<String, Long> {
    val events = usm.queryEvents(startMs, endMs)
    val last = mutableMapOf<String, Long>()
    val totals = mutableMapOf<String, Long>()
    val e = UsageEvents.Event()
    while (events.hasNextEvent()) {
      events.getNextEvent(e)
      val pkg = e.packageName ?: continue
      when (e.eventType) {
        UsageEvents.Event.ACTIVITY_RESUMED, UsageEvents.Event.MOVE_TO_FOREGROUND -> {
          last[pkg] = e.timeStamp
        }
        UsageEvents.Event.ACTIVITY_PAUSED, UsageEvents.Event.MOVE_TO_BACKGROUND -> {
          val s = last.remove(pkg) ?: continue
          val dur = (e.timeStamp - s).coerceAtLeast(0)
          totals[pkg] = (totals[pkg] ?: 0L) + dur
        }
      }
    }
    return totals
  }
}
