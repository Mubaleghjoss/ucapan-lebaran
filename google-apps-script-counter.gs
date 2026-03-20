function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var props = PropertiesService.getScriptProperties();
  var current = Number(props.getProperty("thr_rank") || "0");

  return jsonOutput({
    ok: true,
    rank: current
  });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var props = PropertiesService.getScriptProperties();
    var current = Number(props.getProperty("thr_rank") || "0");
    var nextRank = current + 1;
    var payload = {};

    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    props.setProperty("thr_rank", String(nextRank));

    return jsonOutput({
      ok: true,
      rank: nextRank,
      event: payload.event || "thr_click",
      duration_seconds: Number(payload.duration_seconds || 0)
    });
  } catch (error) {
    return jsonOutput({
      ok: false,
      error: String(error)
    });
  } finally {
    lock.releaseLock();
  }
}
