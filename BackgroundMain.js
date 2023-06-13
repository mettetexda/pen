console.log = function() {
};
function k(a) {
  return null !== a && void 0 !== a && "" !== a;
}
;function p(a) {
  return {oRequest:a, uType:2, strExtensionVersion:chrome.runtime.getManifest().version, bReqFromExtension:!0,};
}
function q(a) {
  return {oRequest:a, uType:3, strExtensionVersion:chrome.runtime.getManifest().version, bReqFromExtension:!0};
}
function aa(a, b, c, e, d) {
  console.log("regenerate");
  var f = p({uService:2277});
  r(f, "POST", "/zpaduserrequest.php", function(g, h) {
    h ? g.oResponse.token ? w({csrf_token:g.oResponse.token}).then(() => {
      b.CSRFtoken = g.oResponse.token;
      a ? r(b, c, e, d) : d();
    }) : d() : d();
  });
}
function r(a, b, c, e) {
  A(["csrf_token"], d => {
    a.CSRFtoken = d.csrf_token;
    d = "requestdata=" + encodeURIComponent(JSON.stringify(a));
    var f = "https://annotate.net" + c, g = new AbortController(), h = setTimeout(() => {
      g.abort();
    }, 30000);
    fetch(f, {method:b, signal:g.signal, headers:{"Content-type":"application/x-www-form-urlencoded"}, body:d}).then(l => {
      clearTimeout(h);
      return l.text();
    }).then(l => {
      var m = null;
      try {
        m = JSON.parse(l);
      } catch (v) {
        e(null, !1, a);
      }
      m ? m.uErrorNo && 21 == m.uErrorNo ? (console.log("error 21"), aa(!0, a, b, c, e)) : m.oResponse && m.oResponse.bSuccessful ? e(m, !0, a) : e(m, !1, a) : e(null, !1, a);
    }).catch(() => {
      e(null, !1, a);
    });
  });
}
function ba(a, b, c) {
  console.log("req. generation ");
  b = "/" != b.charAt(0) ? "/" + b : b;
  var e = "https://annotate.net" + b, d = new AbortController(), f = setTimeout(() => {
    d.abort();
  }, 30000);
  fetch(e, {method:"POST", signal:d.signal, body:a}).then(g => {
    clearTimeout(f);
    return g.text();
  }).then(g => {
    var h = null;
    try {
      h = JSON.parse(g);
    } catch (l) {
      c(null, !1, a);
    }
    h ? h.uErrorNo && 21 == h.uErrorNo ? (console.log("error 21"), aa(!0, a, "POST", b, c)) : h.oResponse && h.oResponse.bSuccessful ? c(h, !0, a) : h.data ? c(h, !0, a) : c(h, !1, a) : c(null, !1, a);
  }).catch(() => {
    c(null, !1, a);
  });
}
function ca(a, b, c, e, d) {
  fetch(c, {method:"GET"}).then(f => f.blob()).then(f => {
    a.append(b, f);
    e();
  }).catch(() => {
    d();
  });
}
function F(a, b, c, e) {
  let d = new FormData();
  d.append("requestdata", JSON.stringify(a));
  if (null != b) {
    let f = Object.keys(b).length, g = 0, h = () => {
      c(null, !1, null);
    }, l = () => {
      g++;
      if (g < f) {
        let m = Object.keys(b)[g];
        ca(d, m, b[m], l, h);
      } else {
        ba(d, e, c);
      }
    };
    a = Object.keys(b)[g];
    ca(d, a, b[a], l, h);
  } else {
    ba(d, e, c);
  }
}
function da(a, b, c) {
  let e = b.tab.id;
  a = a.requestData;
  let d = a.strPath, f = a.oRequest, g = a.files, h = p(f);
  A(["loginResponse"], l => {
    (l = l.loginResponse) && 3 == l.uUserType && (h = q(f));
    F(h, g, function(m, v) {
      console.log(m);
      m = {type:"chromeExtensionServerResponse", bSuccessful:v, response:JSON.stringify(m), sourceTabId:e};
      c(m);
    }, d);
  });
}
function ea(a, b) {
  a = p({uService:1060, uRoomId:a.uRoomId, strExtraData:a.strExtraData,});
  F(a, null, function(c, e) {
    c = {type:"annotateUpdatePresentationExtraDataResponse", bSuccessful:e, response:JSON.stringify(c),};
    b && b(c);
  }, "/edgeconnection/livefeedroom");
}
function fa() {
  var a = p({uService:805, uRequestId:-1,});
  F(a, null, function() {
  }, "/request.php");
}
function ha(a, b) {
  fa();
  var c = {uService:1052, uRoomId:a.uRoomId, strUserGuid:a.strUserGuid, uRequestId:-1,};
  a.bClosingFromBackgroundOnLogin && (c.bClosingFromBackgroundOnLogin = a.bClosingFromBackgroundOnLogin);
  c = p(c);
  F(c, null, function(e, d) {
    console.log("Close Private Livefeed response", d);
    e = {type:"annotateClosePresentationResponse", bSuccessful:d, response:JSON.stringify(e), bLoaderVisible:a.bShowLoader,};
    b && b(e);
  }, "/edgeconnection/livefeedroom");
}
function ia(a, b) {
  if (null != b && null != b.tab) {
    var c = b.tab.id, e = b.frameId, d = b.tab.windowId;
    b = p({uService:2381, strOwnerGuid:a.strOwnerGuid, bOwnedFile:a.bOwnedFile, strGuid:a.strGuid, uFileType:2, strLockOwnerGuid:a.strLockOwnerGuid, bAutoInitiated:a.bAutoInitiated});
    F(b, null, (f, g) => {
      let h = {type:"ANNOTATE_RES_UPDATE_FILE_LOCK_OWNER", bSuccessful:g, bLoaderVisible:a.bLoaderVisible, strGuid:a.strGuid, uDocType:a.uDocType, reqSourceTabId:c, reqSourceTabFrameId:e, reqSourceTabWindowId:d};
      g && (f = f.oResponse, h.strLockOwnerFirstName = f.strLockOwnerFirstName, h.strLockOwnerLastName = f.strLockOwnerLastName, h.uLockOwnerGender = parseInt(f.uLockOwnerGender), h.strLockOwnerGuid = f.strLockOwnerGuid, h.versionNo = f.uVersionNo);
      G(c, h);
    }, "/request.php");
  }
}
function ja(a, b) {
  a = p({uService:2155, strGuid:a.strGuid, uFileType:2,});
  F(a, null, (c, e) => {
    b && b({type:"ANNOTATE_RES_RENEW_FILE_LOCK", bSuccessful:e,});
  }, "/request.php");
}
function ka(a, b) {
  a = p({uService:2383, strGuid:a.strGuid, uFileType:2, bOwnedFile:a.bOwnedFile, strOwnerGuid:a.strOwnerGuid, uAcquireIfFree:1});
  F(a, null, (c, e) => {
    let d = {type:"ANNOTATE_RES_GET_FILE_LOCK_OWNER_INFO", bSuccessful:e};
    e && (c = c.oResponse, d.strLockOwnerFirstName = c.strLockOwnerFirstName, d.strLockOwnerLastName = c.strLockOwnerLastName, d.uLockOwnerGender = parseInt(c.uLockOwnerGender), d.strLockOwnerGuid = c.strLockOwnerGuid, d.versionNo = c.uVersionNo, d.oLivefeed = k(c.oLivefeed) ? c.oLivefeed : null);
    b && b(d);
  }, "/request.php");
}
function la(a, b) {
  A(["loginResponse"], c => {
    var e = c.loginResponse;
    if (k(e)) {
      c = 643;
      "REQ_UPDATE_FEATURES_USE_REQUEST" == a.type && (c = 645);
      c = {uService:c, arrFeature:a.arrFeature, uOffset:a.uOffset,};
      var d = 2 == e.uUserType;
      e = d ? "/request.php" : "zpadstudentrequest.php";
      c = d ? p(c) : q(c);
      F(c, null, (f, g) => {
        let h = {bSuccessful:g};
        g && (h.arrFeature = f.oResponse.arrFeature);
        b && b(h);
      }, e);
    } else {
      b && b({bSuccessful:!1});
    }
  });
}
function ma(a, b) {
  ha({bClosingFromBackgroundOnLogin:!0, uRoomId:a, strUserGuid:b, bShowLoader:!1}, null);
}
function na(a) {
  a = p({uService:2385, strOpenRoomId:a, uRequestId:-1,});
  F(a, null, function(b, c) {
    console.log("AutoTerminate Livefeed response", c);
  }, "/request.php");
}
function oa(a, b, c) {
  a = p({uService:1052, bForExtensionOpenRoomEnd:!0, strOpenRoomId:a, strUserGuid:b, strTeacherKey:c, uRequestId:-1,});
  F(a, null, function(e, d) {
    console.log("Notify Open Livefeed Ended response", d);
  }, "/edgeconnection/livefeedroom");
}
;let pa = {};
function A(a, b) {
  let c = {}, e = [];
  for (let d of a) {
    d in pa ? c[d] = pa[d] : e.push(d);
  }
  e.length ? chrome.storage.local.get(e).then(d => {
    -1 != e.indexOf("loginResponse") && ("loginResponse" in d || (d.loginResponse = null));
    -1 != e.indexOf("arrClickData") && ("arrClickData" in d || (d.arrClickData = []));
    -1 != e.indexOf("arrTempClickData") && ("arrTempClickData" in d || (d.arrTempClickData = []));
    -1 != e.indexOf("bShowHighlight") && ("bShowHighlight" in d || (d.bShowHighlight = !0));
    -1 != e.indexOf("bAnnotationMode") && ("bAnnotationMode" in d || (d.bAnnotationMode = !0));
    -1 != e.indexOf("bHideWhenMinimize") && ("bHideWhenMinimize" in d || (d.bHideWhenMinimize = !1));
    -1 != e.indexOf("bAllowDrawingWhenMinimize") && ("bAllowDrawingWhenMinimize" in d || (d.bAllowDrawingWhenMinimize = !1));
    -1 != e.indexOf("bShowFloatingButtons") && ("bShowFloatingButtons" in d || (d.bShowFloatingButtons = !0));
    -1 != e.indexOf("bStylusModeAsked") && ("bStylusModeAsked" in d || (d.bStylusModeAsked = !1));
    -1 != e.indexOf("bStylusMode") && ("bStylusMode" in d || (d.bStylusMode = !1));
    -1 != e.indexOf("bGoogleDrivePermissionAccepted") && ("bGoogleDrivePermissionAccepted" in d || (d.bGoogleDrivePermissionAccepted = !1));
    -1 != e.indexOf("bShowGoogleSlideFeatureUpdateDialog") && ("bShowGoogleSlideFeatureUpdateDialog" in d || (d.bShowGoogleSlideFeatureUpdateDialog = !1));
    -1 != e.indexOf("bShowAnnotationSavedMsg") && ("bShowAnnotationSavedMsg" in d || (d.bShowAnnotationSavedMsg = !0));
    -1 != e.indexOf("bShowDeleteAllWarning") && ("bShowDeleteAllWarning" in d || (d.bShowDeleteAllWarning = !0));
    -1 != e.indexOf("bStudentNotesOpen") && ("bStudentNotesOpen" in d || (d.bStudentNotesOpen = !1));
    -1 != e.indexOf("bShowHighlight") && ("bShowHighlight" in d || (d.bShowHighlight = !0));
    -1 != e.indexOf("bGradeWithAnnotate") && ("bGradeWithAnnotate" in d || (d.bGradeWithAnnotate = !1));
    -1 != e.indexOf("toolbarPositionForTab") && ("toolbarPositionForTab" in d || (d.toolbarPositionForTab = {}));
    -1 != e.indexOf("livefeedStartedTabInfo") && ("livefeedStartedTabInfo" in d || (d.livefeedStartedTabInfo = null));
    -1 != e.indexOf("uEventServerConnectedTabId") && ("uEventServerConnectedTabId" in d || (d.uEventServerConnectedTabId = -1));
    -1 != e.indexOf("bCCLConnected") && ("bCCLConnected" in d || (d.bCCLConnected = null));
    -1 != e.indexOf("bWebConnected") && ("bWebConnected" in d || (d.bWebConnected = null));
    -1 != e.indexOf("mapLivefeedTab") && ("mapLivefeedTab" in d || (d.mapLivefeedTab = {}));
    -1 != e.indexOf("mapLastLoadAnnotationReqForTab") && ("mapLastLoadAnnotationReqForTab" in d || (d.mapLastLoadAnnotationReqForTab = {}));
    -1 != e.indexOf("accessToken") && ("accessToken" in d || (d.accessToken = ""));
    -1 != e.indexOf("googleUserId") && ("googleUserId" in d || (d.googleUserId = ""));
    -1 != e.indexOf("bMarkNewTabLivefeedLaunchOnTabCreate") && ("bMarkNewTabLivefeedLaunchOnTabCreate" in d || (d.bMarkNewTabLivefeedLaunchOnTabCreate = !1));
    -1 != e.indexOf("uTabIdLivefeedLaunchForCCL") && ("uTabIdLivefeedLaunchForCCL" in d || (d.uTabIdLivefeedLaunchForCCL = -1));
    -1 != e.indexOf("LastCCLLivefeedTabData") && ("LastCCLLivefeedTabData" in d || (d.LastCCLLivefeedTabData = {message:null, tabId:-1}));
    -1 != e.indexOf("LastORLivefeedTabData") && ("LastORLivefeedTabData" in d || (d.LastORLivefeedTabData = null));
    -1 != e.indexOf("mapExportInProgressTab") && ("mapExportInProgressTab" in d || (d.mapExportInProgressTab = {}));
    -1 != e.indexOf("accessToken") && ("accessToken" in d || (d.accessToken = ""));
    -1 != e.indexOf("bAccountSwitched") && ("bAccountSwitched" in d || (d.bAccountSwitched = !1));
    -1 != e.indexOf("googleUserId") && ("googleUserId" in d || (d.googleUserId = ""));
    for (let f in d) {
      f in pa || (pa[f] = d[f]), c[f] = pa[f];
    }
    b(c);
  }) : Promise.resolve().then(() => {
    b(c);
  });
}
function qa(a) {
  A("loginResponse bShowHighlight bAnnotationMode bHideWhenMinimize bAllowDrawingWhenMinimize bShowFloatingButtons bStylusModeAsked bStylusMode bGoogleDrivePermissionAccepted bShowGoogleSlideFeatureUpdateDialog bShowAnnotationSavedMsg bShowDeleteAllWarning bStudentNotesOpen bGradeWithAnnotate toolbarPositionForTab livefeedStartedTabInfo uEventServerConnectedTabId bCCLConnected bWebConnected accessToken googleUserId bMarkNewTabLivefeedLaunchOnTabCreate uTabIdLivefeedLaunchForCCL LastCCLLivefeedTabData".split(" "), 
  b => {
    a(b);
  });
}
function w(a) {
  for (let b in a) {
    pa[b] = a[b];
  }
  return chrome.storage.local.set(a);
}
function ra(a) {
  let b = "loginResponse googleUserId livefeedStartedTabInfo uEventServerConnectedTabId bCCLConnected bWebConnected bMarkNewTabLivefeedLaunchOnTabCreate uTabIdLivefeedLaunchForCCL LastCCLLivefeedTabData mapLivefeedTab mapLastLoadAnnotationReqForTab mapExportInProgressTab LastORLivefeedTabData toolbarPositionForTab".split(" ");
  for (let c of b) {
    delete pa[c];
  }
  chrome.storage.local.remove(b).then(() => {
    I(!1, a);
  });
  console.log("uEventServerConnectedTabId ", -1, "ON LOGOUT");
}
;var sa = null, ta = null;
function ua(a, b, c) {
  sa = function() {
    c(b);
  };
  G(a.tab.id, {type:"annotateRegenerateAuthToken"});
}
function va(a, b) {
  ta = b;
  G(a.tab.id, {type:"annotateGetAuthTokenFromTopWindow"});
}
;function wa(a, b, c) {
  let e = "/docs/viewer";
  a.D = b;
  let d = {};
  if (a.s) {
    b = JSON.parse(b);
    let f = {action:"open", userId:""};
    b.isGoogleDocFile ? f.exportIds = [b.googleFileId] : f.ids = [b.googleFileId];
    e += "?state=" + encodeURIComponent(JSON.stringify(f));
    e += "&";
  } else {
    d.pdfUrl = b, e += "?";
  }
  d.uDocType = a.j;
  a.m && (d.shared = a.m);
  a.l && (d.bCoTeacherPublishedFile = a.l);
  a.i && (d.guid = a.i);
  -1 != a.A && (d.uLivefeedType = a.A);
  -1 != a.v && (d.uLivefeedActivityId = a.v);
  -1 != a.u && (d.uClassId = a.u);
  e += "pdfData=" + btoa(JSON.stringify(d));
  null != a.h && (e += "&extraData=" + btoa(JSON.stringify(a.h)));
  if (null == a.tab) {
    return chrome.tabs.create({active:!0, url:"https://annotate.net" + e}, f => {
      a.tab = f;
      xa(a.F, f.id, 0, a);
      chrome.windows.update(f.windowId, {focused:!0});
      chrome.tabs.update(f.id, {active:!0});
      ya(a, g => {
        g ? c({success:!0}) : c({success:!1});
      });
    }), !0;
  }
  chrome.tabs.update(a.tab.id, {url:"https://annotate.net" + e}, f => {
    chrome.windows.update(f.windowId, {focused:!0});
    chrome.tabs.update(f.id, {active:!0});
  });
  return !1;
}
function ya(a, b) {
  if (a.s) {
    b(!0);
  } else {
    a.o && (a.o.abort(), a.o = null);
    a.o = new AbortController();
    var c = {"Content-type":"application/x-www-form-urlencoded"};
    a.C && (c.Authorization = "Bearer " + a.C, a.C = null);
    fetch(a.url, {method:"GET", headers:c}).then(e => {
      a.o = null;
      var d = "", f = e.headers.get("Content-Disposition");
      f && -1 !== f.indexOf("inline") ? (f = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(f), null != f && f[1] && (d = f[1].replace(/['"]/g, ""))) : (f = a.url.lastIndexOf("/"), -1 != f && (d = a.url.substring(f + 1), f = d.indexOf("?"), -1 != f && (d = d.substring(0, f)), d = decodeURIComponent(d)), a.filename = d);
      e.blob().then(g => {
        a.filename = d;
        let h = new FileReader();
        h.onload = function(l) {
          l = l.target.result;
          if (10485760 >= l.length) {
            chrome.tabs.sendMessage(a.tab.id, {type:za, pdfUrl:l, pdfName:a.filename}, {frameId:a.g ? a.g.frameId : 0});
          } else {
            let m = 0, v = !0;
            for (; m < l.length;) {
              let t = !1, n = 10485760;
              10485760 > l.length - m && (t = !0, n = l.length - m);
              chrome.tabs.sendMessage(a.tab.id, {type:Aa, pdfUrl:l.substring(m, m + n), pdfName:a.filename, "final":t, start:v}, {frameId:a.g ? a.g.frameId : 0});
              m += n;
              v = !1;
            }
          }
          b(!0);
        };
        h.readAsDataURL(g);
      }).catch(() => {
        b(!1);
      });
    }).catch(() => {
      b(!1);
    });
  }
}
class Da {
  constructor(a) {
    this.url = "";
    this.F = a;
    this.tab = null;
    this.frameId = -1;
    this.filename = "";
    this.i = null;
    this.u = -1;
    this.l = this.m = !1;
    this.C = null;
    this.s = !1;
    this.h = this.o = null;
    this.j = 1;
    this.D = "";
    this.v = this.A = -1;
    this.g = null;
  }
  B(a, b) {
    this.g = a;
    let c = !this.s || this.i && 3 != this.j;
    ya(this, e => {
      e ? this.i && 3 != this.j ? A(["mapLastLoadAnnotationReqForTab", "bAnnotationMode"], d => {
        if (d) {
          var f = d.mapLastLoadAnnotationReqForTab;
          f && (f = f[a.tab.id]) && f.loadCallbackArgs && f.loadCallbackArgs.extraData && (d.bAnnotationMode && (d.bAnnotationMode = !1, w(d).then(() => {
            I(!1);
            Ea();
          })), this.h || (this.h = {}), this.h.bLaunchNotesViewer = f.loadCallbackArgs.extraData.bLaunchNotesViewer, this.h.strStudentGuid = f.loadCallbackArgs.extraData.strStudentGuid);
        }
        K(this.i, this.tab.id, a, b, !1, !0, !1, this.j, !0, this.u, this.D, this.m, !1, this.l, this.A, this.v, this.h);
        this.h = this.i = null;
      }) : b({success:!0}) : b({success:!1});
    });
    return c;
  }
}
function xa(a, b, c, e) {
  let d;
  a.g.has(b) ? d = a.g.get(b) : (d = new Map(), a.g.set(b, d));
  d.set(c, e);
}
function Fa(a, b, c) {
  let e = null;
  -1 != b && a.g.has(b) && (b = a.g.get(b), b.has(c) && (e = b.get(c)));
  null == e && (e = new Da(a));
  return e;
}
function Ga(a, b) {
  var c = Fa(Ha, -1, 0);
  return wa(c, a, b);
}
function Ia(a, b, c, e, d, f, g, h, l, m, v, t) {
  var n = Ha;
  let y = -1;
  f && (y = f.id);
  n = Fa(n, y, 0);
  f && (n.tab = f);
  n.i = b;
  n.j = c;
  n.m = e;
  n.u = g;
  n.l = h;
  n.A = l;
  n.v = m;
  n.h = v;
  n.s = d;
  wa(n, a, t);
}
class Ja {
  constructor() {
    this.g = new Map();
  }
  B(a, b, c) {
    let e = 0;
    b && (e = b.frameId);
    let d = Fa(this, b.tab.id, e);
    if (a.isDriveFile) {
      let f = JSON.stringify({isDriveFile:!0, googleFileId:a.googleFileId, isGoogleDocFile:a.isGoogleDocFile, googleUserId:""});
      d.url = f;
      d.tab = b.tab;
      d.s = !0;
      xa(this, b.tab.id, e, d);
    } else {
      a.strPdfUrl && a.strPdfUrl.length && (d.tab = b.tab, d.url = a.strPdfUrl, xa(this, b.tab.id, e, d));
    }
    return d ? (a.strGUID ? d.i = a.strGUID : d.i = "", a.uDocType && (d.j = a.uDocType), a.bShared && (d.m = a.bShared), a.bCoTeacherPublishedFile && (d.l = a.bCoTeacherPublishedFile), "uLivefeedType" in a && (d.A = a.uLivefeedType), "uLivefeedActivityId" in a && (d.v = a.uLivefeedActivityId), "uClassId" in a && (d.u = a.uClassId), "extraData" in a && (d.h = a.extraData), d.B(b, c)) : !1;
  }
}
;function Ka(a, b, c) {
  A(["loginResponse"], e => {
    if (e.loginResponse) {
      e = a.arrStudentGuid;
      let d = {uService:2275, uClassId:a.uClassId, strAnnotationGuid:a.strAnnotationGuid, bOwnedFile:a.bOwnedFile};
      e ? d.arrStudentGuid = e : d.bLoadAllStudents = 1;
      e = p(d);
      r(e, "POST", "/zpaduserrequest.php", function(f, g) {
        if (g) {
          if (g = f.oResponse) {
            f = g.arrStudentAnnotation, g = g.bNotesAllowed, f && (La(c.tab.id, {bLaunchNotesViewer:!0}), b({type:"annotateStudentNotesLoaded", serverURL:"https://annotate.net", arrStudentAnnotation:f, bNotesAllowed:g}));
          }
        } else {
          b && b({type:"annotateStudentNotesLoadError", errorType:1});
        }
      });
    }
  });
}
function Ma(a) {
  A(["loginResponse"], b => {
    b = b.loginResponse;
    let c = a.oAnnotation;
    k(b) && k(c) && !b.arrWebAnnotations.find(e => e.strGUID == c.strGUID) && (b.arrWebAnnotations.push(c), w({loginResponse:b}).then(() => {
      I(!1);
    }), console.log(`new doc ${c.strGUID} info added in arrWebAnnotations`));
  });
}
function Na(a) {
  A(["loginResponse"], b => {
    b.loginResponse && (b = p({uService:2311, bNotesAllowed:a.bNotesAllowed, strAnnotationGuid:a.strAnnotationGuid, uClassId:a.uClassId, bOwnedFile:a.bOwnedFile}), r(b, "POST", "/zpaduserrequest.php", () => {
    }));
  });
}
function Oa(a, b) {
  A(["loginResponse"], c => {
    c.loginResponse && Pa(a.strAnnotationGuid, b);
  });
}
function Pa(a, b) {
  a = q({uService:2313, annotationGuid:a});
  r(a, "POST", "/zpadstudentrequest.php", function(c, e) {
    if (e) {
      if (c = c.oResponse) {
        if (e = c.oFeedbackFile) {
          c = {type:"annotateStudentFeedbackDocLoaded",}, e = {strGUID:e.strGUID, strAnnotationPath:e.strAnnotationPath, versionNo:e.uVersionNo, annotationData:JSON.parse(e.strAnnotationDoc), strPublisherGuid:e.strUserGuid, strPublisherPicture:e.strUserPicture, oPublisherPicturePosition:e.oUserPicturePosition, strPublisherFirstName:e.strFirstName, strPublisherLastName:e.strLastName, uPublisherFeatureValue:e.uPublisherFeatureValue,}, c.feedbackData = e, b(c);
        }
      }
    } else {
      b({type:"annotateStudentFeedbackDocLoadError", errorType:1});
    }
  });
}
;let Qa = 0;
function Ra(a, b, c) {
  const e = 3 == b.uUserType ? "/zpadstudentrequest.php" : "/request.php";
  var d = {uService:2361, strCloneAnnotationMapGUID:b.strCloneAnnotationMapGUID, arrStudentGuid:[], bLoadAllStudents:1};
  3 == b.uUserType ? (d.bLoadAllStudents = 0, d.arrStudentGuid = [b.strUserGuid]) : 2 == b.uUserType && b.strStudentGuid && 0 != a.frameId ? (d.bLoadAllStudents = 0, d.arrStudentGuid = [b.strStudentGuid]) : b.arrStudentGuid && 0 < b.arrStudentGuid.length && (d.arrStudentGuid = b.arrStudentGuid);
  d = 3 == b.uUserType ? q(d) : p(d);
  r(d, "POST", e, function(f, g) {
    g && f.oResponse && f.oResponse.bSuccessful ? Sa(f.oResponse, a, b, c) : G(a.tab.id, {type:"COMM_GET_ALL_STUDENT_SUBMISSIONS_FOR_WEB", bSuccessful:!1, strCloneAnnotationMapGUID:b.strCloneAnnotationMapGUID, strBaseUrl:b.strBaseUrl});
  });
}
function Sa(a, b, c, e) {
  if (2 == c.uUserType && 0 == b.frameId) {
    A(["mapLastLoadAnnotationReqForTab"], () => {
      let h = "";
      c && c.strStudentGuid && (h = c.strStudentGuid);
      G(e, {type:"COMM_GET_ALL_STUDENT_SUBMISSIONS_FOR_WEB", bSuccessful:!0, arrStudentAnnotation:a.arrStudentAnnotation, strStudentGuid:h, strAnnotateClassName:a.strAnnotateClassName});
    });
  } else {
    console.log(`${"Load annotations for student"} >> ${performance.now() - Qa} ms`);
    Qa = 0;
    var d = 2 == c.uUserType ? 3 : 2, f = a.arrStudentAnnotation[0], g = f.courseWorkDetails;
    f = {bGoogleAssignmentAutosaved:!0, uDocType:d, strAnnotateDataRequestUrl:a.strAnnotateDataRequestUrl, strS3BucketFullPath:a.strS3BucketFullPath, oAnnotationFile:f.oAnnotationFile, oFeedbackFile:f.oFeedbackFile, uVersionNo:-1, strAnnotationDoc:JSON.stringify({}), courseWorkDetails:f.courseWorkDetails};
    Ta(f, e, b, !1, !0, !1, d, !1, g.uClassId, c.strBaseUrl, !1, !1, -1, -1, null, !0);
  }
}
function Ua(a, b) {
  A(["loginResponse"], c => {
    c = c.loginResponse;
    Ra(b, {strCloneAnnotationMapGUID:a.strCloneAnnotationMapGUID, strUserGuid:c.strUserGuid, uUserType:c.uUserType, strBaseUrl:a.strBaseUrl});
  });
}
function Va(a, b, c) {
  b = p({uService:2365, strStudentGuid:b.strStudentGuid, strGoogleCourseWorkId:b.strGoogleCourseWorkId});
  r(b, "POST", "/request.php", function(e, d) {
    A(["mapLastLoadAnnotationReqForTab"], f => {
      const g = {type:"COMM_GET_STUDENT_SUBMISSION_FOR_WEB", bSuccessful:!1};
      d && e && e.oResponse && e.oResponse.bSuccessful && (g.bSuccessful = !0, g.oAnnotationFile = e.oResponse.oAnnotationFile, g.oFeedbackFile = e.oResponse.oFeedbackFile, g.courseWorkDetails = e.oResponse.courseWorkDetails);
      f = f.mapLastLoadAnnotationReqForTab;
      let h = f[a.tab.id];
      h && (h.loadCallbackArgs.extraData && (h.loadCallbackArgs.extraData.strStudentGuid = g.courseWorkDetails.strStudentGuid), f[a.tab.id] = h, w({mapLastLoadAnnotationReqForTab:f}));
      c(g);
    });
  });
}
function Wa(a, b) {
  a = p({uService:2367, uVersionNo:a.uVersionNo, strAnnotationGuid:a.strAnnotationGuid});
  r(a, "POST", "/request.php", function(c, e) {
    e && c ? (c = c.oResponse, b({bSuccessful:c.bSuccessful, bVersionMismatch:c.bVersionMismatch, oAnnotationFile:c.oDoc})) : b({bSuccessful:!1});
  });
}
function Ya(a) {
  a = p({uService:2373, id:a.id, uPoints:a.uPoints,});
  r(a, "POST", "/request.php", function(b, c) {
    c && b ? console.log(">> succeed to update coursework points") : console.log(">> failed to update coursework points");
  });
}
;var Za = null, $a = null, ab = null, L = [], bb = [], Ha = new Ja(), za = "ANNOTATE_PDF_OPEN", Aa = "ANNOTATE_PDF_OPEN_PARTIAL";
chrome.runtime.onInstalled.addListener(function(a) {
  chrome.contextMenus && (chrome.contextMenus.create({id:"annotate hightlight", title:"Highlight", contexts:["selection"]}), chrome.contextMenus.create({id:"annotate add image", title:"Add image to notebook", contexts:["image"],}));
  setTimeout(() => {
    cb();
    "update" == a.reason && setTimeout(() => {
      db({type:"annotateShowUpdateSuccessfulDialog"});
    }, 2000);
  }, 2000);
});
chrome.contextMenus && chrome.contextMenus.onClicked.addListener(function(a) {
  "annotate hightlight" == a.menuItemId ? db({type:"annotateHighlightSelectedText"}) : "annotate add image" == a.menuItemId && a && eb(a);
});
chrome.runtime.onUpdateAvailable && chrome.runtime.onUpdateAvailable.addListener(function() {
  A(["bAnnotationMode", "bUpdateDialogShown"], a => {
    var b = a.bUpdateDialogShown;
    a.bAnnotationMode ? b || w({bUpdateDialogShown:!0}).then(() => {
      db({type:"annotateShowUpdateAvailableDialog"});
    }) : chrome.runtime.reload();
  });
});
function fb() {
  chrome.runtime.requestUpdateCheck(function() {
  });
}
chrome.runtime.requestUpdateCheck && chrome.alarms.create("checkforupdate", {periodInMinutes:30});
function gb(a) {
  a || (a = !1);
  chrome.contextMenus && chrome.contextMenus.update && chrome.contextMenus.update("annotate add image", {enabled:a});
}
function hb(a) {
  let b = !1;
  A(["loginResponse"], c => {
    c = c.loginResponse;
    null != c && c.bLoggedIn || (b = !0);
    a({uService:2129, bIncludeLivefeedIfInstructorLoggedIn:b, uOffset:(new Date()).getTimezoneOffset()});
  });
}
function N(a) {
  $a || hb(b => {
    b = p(b);
    b = "requestdata=" + JSON.stringify(b);
    $a = new AbortController();
    var c = setTimeout(() => {
      $a.abort();
    }, 30000);
    fetch("https://annotate.net/zpadopenrequest.php", {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded",}, body:b, signal:$a.signal}).then(e => {
      clearTimeout(c);
      $a = null;
      return e.text();
    }).then(e => {
      var d = JSON.parse(e);
      e = null;
      if (d && d.oResponse && d.oResponse.strName) {
        var f = {};
        e = {bLoggedIn:!0, ChromeClientLogin:d.oResponse.ChromeClientLogin, uUserId:d.oResponse.uUserId, strUserGuid:d.oResponse.strUserGuid, name:d.oResponse.strName, strOpenRoomKey:k(d.oResponse.strOpenRoomKey) ? d.oResponse.strOpenRoomKey : null, strFirstName:d.oResponse.strFirstName, strLastName:d.oResponse.strLastName, strUserName:d.oResponse.strUserName, uUserType:d.oResponse.uUserType, bUserType:d.oResponse.bFU, uFeatureValue:d.oResponse.uFeatureValue, bEducationalTeacherAccount:d.oResponse.bEducationalTeacherAccount, 
        uAllowedSaveCount:d.oResponse.uAllowedSaveCount, strUserPicture:d.oResponse.strUserPicture, oUserPicturePosition:d.oResponse.oUserPicturePosition, arrWebAnnotations:d.oResponse.arrWebAnnotations, bShowStylusModeChangeOptionMsg:2 != d.oResponse.uStylusModeChangeOptionMsg, serverUpgradeUrl:"https://annotate.net/login.php?continue=upgrade", serverPricingPageUrl:"https://annotate.net/pricing", strSession:d.oResponse.strSession, strMediaRecorderServerIP:d.oResponse.strMediaRecorderServerIP, strS3BucketFullPath:d.oResponse.strS3BucketFullPath, 
        strAnnotateDataRequestUrl:"https://annotate.net/AnnotateDataRequest.php?src=", uDefaultCategoryId:d.oResponse.uDefaultCategoryId};
        1 == d.oResponse.bOpenUser && (e.uUserType = 4);
        "uHasOwner" in d.oResponse && (e.uHasOwner = d.oResponse.uHasOwner);
        d.oResponse.arrBetaFeature && (e.arrBetaFeature = d.oResponse.arrBetaFeature);
        d.oResponse.planInfo && (e.planInfo = d.oResponse.planInfo);
        e.bGuidSupported = d.oResponse.bGuidSupported ? "1" == d.oResponse.bGuidSupported : !1;
        null != d.oResponse.strKeyboardShortcuts && (e.strKeyboardShortcuts = JSON.parse(d.oResponse.strKeyboardShortcuts));
        null != d.oResponse.bExtensionToolbarOpen && (f.bAnnotationMode = "1" == d.oResponse.bExtensionToolbarOpen);
        null != d.oResponse.bHideExtensionWhenMinimize && (f.bHideWhenMinimize = "1" == d.oResponse.bHideExtensionWhenMinimize, f.bShowFloatingButtons = !f.bHideWhenMinimize);
        null != d.oResponse.bAllowDrawingWhenMinimize && (f.bAllowDrawingWhenMinimize = "1" == d.oResponse.bAllowDrawingWhenMinimize);
        null != d.oResponse.strExtensionCustomProperties && (e.strExtensionCustomProperties = d.oResponse.strExtensionCustomProperties);
        null != d.oResponse.strWebPagesDivClassName && (e.strWebPagesDivClassName = d.oResponse.strWebPagesDivClassName);
        null != d.oResponse.strTimerSetting && (e.strTimerSetting = d.oResponse.strTimerSetting);
        null != d.oResponse.bShowGoogleSlideFeatureUpdateDialog && (f.bShowGoogleSlideFeatureUpdateDialog = 1 == d.oResponse.bShowGoogleSlideFeatureUpdateDialog);
        null != d.oResponse.bShowAnnotationSavedMsg && (f.bShowAnnotationSavedMsg = 1 == d.oResponse.bShowAnnotationSavedMsg);
        null != d.oResponse.bExtensionStudentNotesOpen && (f.bStudentNotesOpen = 1 == d.oResponse.bExtensionStudentNotesOpen);
        null != d.oResponse.bGradeWithAnnotate && (f.bGradeWithAnnotate = 1 == d.oResponse.bGradeWithAnnotate);
        null != d.oResponse.token && (f.csrf_token = d.oResponse.token);
        null == d.oResponse.ActiveWebAnnotationLivefeed || d.oResponse.ChromeClientLogin || (d = d.oResponse.ActiveWebAnnotationLivefeed, 1 == d.uLivefeedType ? ma(d.uRoomId, d.strUserGuid) : na(d.strWAOwnerGuid + "_-1_" + d.strWAGuid));
        f.loginResponse = e;
        w(f).then(() => {
          I(!1, a);
        });
      } else {
        1 == d.uErrorNo && (P({type:"ANNOTATE_CLOSE_JOIN_DB_ON_END_LIVEFEED_NOTIFICATION"}), ra(a));
      }
    }).catch(() => {
      clearTimeout(c);
      $a = null;
    });
  });
}
function ib() {
  if (!ab) {
    var a = p({uService:2379});
    a = "requestdata=" + JSON.stringify(a);
    ab = new AbortController();
    var b = setTimeout(() => {
      ab.abort();
    }, 30000);
    fetch("https://annotate.net/zpadopenrequest.php", {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded",}, body:a, signal:ab.signal}).then(c => {
      clearTimeout(b);
      ab = null;
      return c.text();
    }).then(c => {
      (c = JSON.parse(c)) && c.oResponse && c.oResponse.bLogout && (P({type:"ANNOTATE_CLOSE_JOIN_DB_ON_END_LIVEFEED_NOTIFICATION"}), ra(!1));
    }).catch(() => {
      clearTimeout(b);
      ab = null;
    });
  }
}
function jb(a, b, c) {
  a && a.url && 0 == a.frameId && (kb(a.tab.id), lb(a.url) || mb(a.tab.id), nb(a.tab.id));
  a && a.url && ob(a.url) && pb();
  var e = null;
  qa(d => {
    a.tab && (e = d.toolbarPositionForTab[a.tab.id]);
    null != d.bCCLConnected && d.loginResponse && (d.loginResponse.bCCLConnected = d.bCCLConnected);
    null != d.bWebConnected && d.loginResponse && (d.loginResponse.bWebConnected = d.bWebConnected, pb());
    var f = a && qb(a.url);
    d = {tabId:a.tab ? a.tab.id : "", windowId:a.tab ? a.tab.windowId : "", frameId:a.frameId, topURL:a.url, type:"AnnotateLoginResponsePlugin", data:d.loginResponse, bShowHighlight:d.bShowHighlight, bAnnotatePage:f, bAnnotationMode:d.bAnnotationMode, bHideWhenMinimize:d.bHideWhenMinimize, bAllowDrawingWhenMinimize:d.bAllowDrawingWhenMinimize, bShowFloatingButtons:d.bShowFloatingButtons, bStylusModeAsked:d.bStylusModeAsked, bStylusMode:d.bStylusMode, bGoogleDrivePermissionAccepted:d.bGoogleDrivePermissionAccepted, 
    bShowGoogleSlideFeatureUpdateDialog:d.bShowGoogleSlideFeatureUpdateDialog, bShowAnnotationSavedMsg:d.bShowAnnotationSavedMsg, bShowDeleteAllWarning:d.bShowDeleteAllWarning, bStudentNotesOpen:d.bStudentNotesOpen, bGradeWithAnnotate:d.bGradeWithAnnotate, serverUrl:"https://annotate.net", isIOSExtension:!1, PDFViewerUrl:"https://annotate.net/docs/viewer", arrCSSFiles:chrome.runtime.getManifest().content_scripts[0].css, savedToolbarPosition:{type:"annotateSavedToolbarPosition", position:e}, googleUserId:d.googleUserId, 
    accessToken:d.accessToken,};
    b(d);
    if (a.tab) {
      for (0 != a.frameId && (c && c.bSharedContentViewMainIframe || (c && c.isIFrame && c.isParentIFrame ? rb(a.tab.id, a.frameId) : sb(a.tab.id, a.frameId))), d = 0; d < L.length; ++d) {
        if (L[d].tabId == a.tab.id && L[d].frameId == a.frameId) {
          var g = L[d];
          L.splice(d, 1);
          d--;
          if (g.loadCallbackArgs) {
            let h = g.loadCallbackArgs;
            (a.url && -1 != a.url.indexOf("docs.google.com/presentation/d/") || h.strBaseUrl == a.url) && A(["bAnnotationMode"], l => {
              l.bAnnotationMode ? (l.bAnnotationMode = !1, w(l).then(() => {
                I(!1);
                Ea();
                K(h.guid, h.tabId, a, null, h.bForScreenShot, h.bApplyForceFully, h.bSlidesPreview, h.uDocType, h.bPDFViewer, h.uClassId, h.strBaseUrl, h.bShared, h.bUpdateDate, h.bCoTeacherPublishedFile, h.uLivefeedType, h.uLivefeedActivityId, h.extraData, h.bWebPageClassroomAssignment);
              })) : K(h.guid, h.tabId, a, null, h.bForScreenShot, h.bApplyForceFully, h.bSlidesPreview, h.uDocType, h.bPDFViewer, h.uClassId, h.strBaseUrl, h.bShared, h.bUpdateDate, h.bCoTeacherPublishedFile, h.uLivefeedType, h.uLivefeedActivityId, h.extraData, h.bWebPageClassroomAssignment);
            });
          } else {
            g.openSavedAnnotationMessage ? (g = g.openSavedAnnotationMessage, (a.url && -1 != a.url.indexOf("docs.google.com/presentation/d/") || g.strPageUrl == a.url) && tb(g, a, null)) : g.loadCallback();
          }
        }
      }
    }
    f && N(!1);
    ub();
  });
  return !0;
}
function vb(a, b) {
  chrome.tabs.query({url:"https://annotate.net/*"}, function(c) {
    if (0 < c.length) {
      for (var e = 0; e < c.length; e++) {
        if (c[e].url.startsWith("https://annotate.net/instructor") || c[e].url.startsWith("https://annotate.net/student")) {
          c = c[e];
          chrome.windows && chrome.windows.update && chrome.windows.update(c.windowId, {focused:!0});
          chrome.tabs.update(c.id, {active:!0});
          b({bSuccess:!0});
          chrome.tabs.remove(a.tab.id);
          return;
        }
      }
    }
    b({bSuccess:!1});
  });
  return !0;
}
chrome.runtime.onMessage.addListener(function(a, b, c) {
  switch(a.type) {
    case "annotateInitPopup":
    case "annotateInitPluginContent":
      return jb(b, c, a);
    case "AnnotateRedirectToUserSettings":
      return vb(b, c);
    case "annotate":
    case "annotateScreenGet":
      var e = chrome.desktopCapture.chooseDesktopMedia(a.options || ["screen", "window"], b.tab, function(g) {
        a.type = "annotateScreenGot";
        a.sourceId = g;
        c(a);
      });
      a.type = "annotateScreenGetPending";
      a.request = e;
      G(b.tab.id, a, {frameId:b.frameId});
      return !0;
    case "annotateScreenCancel":
      return chrome.desktopCapture.cancelChooseDesktopMedia(a.request), a.type = "annotateScreenCancelGot", c(a), !1;
    case "annotateAutomatePopUp":
      wb(a.values);
      break;
    case "annotateAnnotationModeGot":
      xb(a.value);
      break;
    case "getLocalStorage":
      return A([a.key], g => {
        c(g);
      }), !0;
    case "setLocalStorage":
      return w(a.data).then(() => {
        c({});
      }), !0;
    case "annotateMinimizeModeUpdated":
      yb(a.value);
      break;
    case "annotateAllowMinimizeModeDrawingUpdated":
      zb(a.value);
      break;
    case "AnnotateFloatingButtonClosed":
      w({bShowFloatingButtons:!1}).then(() => {
        I(!1);
      });
      break;
    case "annotateStylusModeAsked":
      w({bStylusModeAsked:!0}).then(() => {
        I(!1);
      });
      break;
    case "annotateStylusModeUpdated":
      w({bStylusMode:a.value ? !0 : !1}).then(() => {
        I(!1);
      });
      break;
    case "annotateStylusModeChangeOptionMsgShown":
      Ab();
      break;
    case "annotateScreenShotGot":
    case "annotateScreenShotGotResponse":
      db(a);
      break;
    case "annotateImportPdfResponse":
      a.tabId ? G(a.tabId, a) : db(a);
      break;
    case "annotateImportPdfFile":
    case "annotateImportPdfStatus":
      a.tabId ? G(a.tabId, a) : P(a);
      break;
    case "annotateCancelPdfImport":
      a.tabId ? G(a.tabId, a) : db(a);
      break;
    case "annotateOpenFileResponse":
    case "annotateDashboardLaunched":
    case "annotateWebAnnotationAssessmentResponse":
      P(a);
      break;
    case "annotateCCLHomeLaunched":
      pb();
      Bb();
      break;
    case "annotateORHomeLaunched":
      Cb();
      break;
    case "annotateScreenShotRectGot":
      Db(a);
      break;
    case "webAnnotationAssessmentStatus":
      Eb({type:a.type, strAssessmentFileGuid:a.strAssessmentFileGuid ? a.strAssessmentFileGuid : null, bOpenedAssessmentFile:a.bOpenedAssessmentFile ? a.bOpenedAssessmentFile : 0, bTaskSubmitted:a.bTaskSubmitted ? a.bTaskSubmitted : 0, taskStatusData:a.taskStatusData ? a.taskStatusData : null, tabId:b.tab.id});
      break;
    case "annotateScreenShotCopy":
      return Fb(a, c), !0;
    case "annotateHighlightModeChanged":
      w({bShowHighlight:a.value ? !0 : !1}).then(() => {
        I(!0);
      });
      break;
    case "annotateImportPdfUrl":
      return Gb(a, b, c), !0;
    case "annotateCheckPDFExistsOnDrive":
      return Hb(a, c), !0;
    case "OpenAnnotatePDFViewer":
      return Ga(a.url, c);
    case "annotateAccountUpgrade":
    case "annotateWebAnnotationsListUpdated":
      N(!1);
      break;
    case "annotateKeyboardShortcutsChanged":
      A(["loginResponse"], g => {
        (g = g.loginResponse) && (g.strKeyboardShortcuts = JSON.parse(a.strKeyboardShortcuts));
        w({loginResponse:g}).then(() => {
          I(!1);
        });
      });
      break;
    case "annotateDeleteAllAnnotationsPreferenceChanged":
      A(["loginResponse"], g => {
        if ((g = g.loginResponse) && g.strExtensionCustomProperties) {
          let h = JSON.parse(g.strExtensionCustomProperties);
          h.uDeleteAllAnnotationPreference = JSON.parse(a.uDeleteAllAnnotationPreference);
          g.strExtensionCustomProperties = JSON.stringify(h);
        }
        w({loginResponse:g}).then(() => {
          I(!1);
        });
      });
      break;
    case "annotateSwitchToAnnotateTab":
      Ib();
      break;
    case "annotateSwitchToTab":
      Jb(a.tabId, a.bCloseSource, a.sourceTabId);
      break;
    case "annotateOpenAnnotateTab":
      Lb();
      break;
    case "annotateOpenFileId":
      Eb({type:"annotateOpenFile", fileid:a.fileid, strGuid:a.strGuid});
      break;
    case "annotateClickData":
      Mb(a);
      break;
    case "saveTimerSettingPreference":
      Nb(a);
      break;
    case "createClip":
      Ob(a, b);
      break;
    case "saveClip":
      Pb(a, b);
      break;
    case "annotateSaveAnnotations":
      Qb(a, b);
      break;
    case "annotateOpenSaveAnnotations":
      return a.bJoinLivefeedReq && a.LivefeedInfo && a.livefeedId ? Rb(a.livefeedId, a.LivefeedInfo, -1) : tb(a, b, c), !0;
    case "ANNOTATE_NEW_WEB_ANNOTATION_FILE_ADDED":
      Ma(a);
      break;
    case "annotateLivefeedDeletedEvent":
      A(["loginResponse"], g => {
        if (g = g.loginResponse) {
          g.ChromeClientLogin ? (null != Q && (clearTimeout(Q), Q = null), Sb()) : (P({type:"ANNOTATE_CLOSE_JOIN_DB_ON_END_LIVEFEED_NOTIFICATION"}), a.evtData.bOpenRoom && Tb());
        }
      });
      break;
    case "annotateLivefeedNotificationEvent":
      A(["loginResponse"], g => {
        (g = g.loginResponse) && g.ChromeClientLogin ? (A(["LastCCLLivefeedTabData"], h => {
          R(a, h.LastCCLLivefeedTabData.tabId);
        }), console.log("LIVEFEED LAUNCH CCL(event):", a.evtData.livefeedId), Ub(a, a.evtData.livefeedId, !1)) : (console.log("LIVEFEED EVENT:", a.evtData.livefeedId), Vb(a), Wb(g) && Xb(Yb(a.evtData.livefeedId, a.evtData.LivefeedInfo, !1)));
      });
      break;
    case "annotateBringCCLLivefeedToView":
      A(["LastCCLLivefeedTabData"], g => {
        g = g.LastCCLLivefeedTabData;
        var h = g.tabId;
        -1 != h ? Jb(h, !1, -1) : g.message && (h = null, g.message.ActiveLivefeedForCCL ? h = g.message.ActiveLivefeedForCCL.livefeedId : g.message.evtData && (h = g.message.evtData.livefeedId), console.log("LIVEFEED LAUNCH CCL(manual):", h), h && Ub(g.message, h, !0));
      });
      break;
    case "annotateBringORLivefeedToView":
      A(["LastORLivefeedTabData"], g => {
        var h = g.LastORLivefeedTabData;
        h && h.message && (g = h.message, h = h.tabId ? h.tabId : -1, P({type:"ANNOTATE_CLOSE_JOIN_DB_ON_END_LIVEFEED_NOTIFICATION"}), Rb(g.livefeedId, g.LivefeedInfo, h));
      });
      break;
    case "checkLivefeedTabMappingAndLaunchOnJoin":
      e = a.LivefeedInfo;
      let d = a.livefeedId, f = -1;
      a.bSelfTabPrefferedOverNew && (f = b.tab.id);
      Rb(d, e, f);
      break;
    case "annotateWebannotationExportStatusEvent":
      Zb(a.evtData);
      break;
    case "annotateResizeWindow":
      $b(a, b);
      break;
    case "AnnotateClosePopup":
      ac();
      break;
    case "annotateLoadGoogleAssignmentAnnotations":
      bc(a, b);
      break;
    case "AnnotateGoogleDrivePermissionAccepted":
      w({bGoogleDrivePermissionAccepted:!0}).then(() => {
        I(!1);
      });
      break;
    case "annotateToolbarPosition":
      cc(a, b);
      break;
    case "annotateGetToolbarPosition":
      return dc(b, c), !0;
    case "AnnotateGoogleSlideFeatureUpdateDialogShown":
      w({bShowGoogleSlideFeatureUpdateDialog:!1}).then(() => {
        I(!1);
        ec();
      });
      break;
    case "annotateAnnotationSavedToAccountMsgShown":
      w({bShowAnnotationSavedMsg:!1}).then(() => {
        I(!1);
        fc();
      });
      break;
    case "AnnotateDoNotShowDeleteAllWarning":
      w({bShowDeleteAllWarning:!1}).then(() => {
        I(!1);
      });
      break;
    case "AnnotateGetDocumentFullScreenState":
    case "StartSlidesPresentationRecording":
    case "StartSlidesPresentationRecordingFailed":
    case "StartSlidesPresentationRecordingSuccess":
    case "DoNotRecordPresentation":
    case "PauseResumeRecClickedInPresentation":
    case "MuteUnmuteClickedInPresentation":
    case "StopRecClickedInPresentation":
    case "UpdateRecordingUIStateInPresentation":
    case "ClipRecordingSaveSuccess":
    case "googleSlidePresentationModeStart":
      gc(a, b);
      break;
    case "annotateUpdateExtension":
      chrome.runtime.reload();
      break;
    case "annotateSaveCustomProperties":
      hc(a, b);
      break;
    case "ANNOTATE_PDF_VIEWER_READY_ON_EXTENSION_INITIALIZED":
    case "ANNOTATE_PDF_VIEWER_READY":
      return Ha.B(a, b, c);
    case "annotatePreviewKeyEvent":
      ic(a, b);
      break;
    case "annotateNavigateSlideGo":
      jc(a, b);
      break;
    case "annotatePreviewIndexChanged":
      a.type = "annotatePresentationIndexChanged";
      a.isParentIFrame ? kc(b.tab.id, a) : G(b.tab.id, a);
      break;
    case "annotatePreviewIndexJumped":
      a.type = "annotatePresentationIndexChanged";
      a.isParentIFrame ? kc(b.tab.id, a) : G(b.tab.id, a);
      break;
    case "annotatePreviewSlideListUpdated":
      a.type = "annotatePresentationSlideListUpdated";
      a.isParentIFrame ? kc(b.tab.id, a) : G(b.tab.id, a);
      break;
    case "annotateUpdateToolbarVisibleState":
      a.type = "annotateUpdatePresToolbarVisibleState";
      G(b.tab.id, a);
      break;
    case "annotatePreviewSlidesAnnotationData":
    case "annotatePreviewSlidesFeedbackAnnotationData":
    case "annotatePreviewSlideKeyEvent":
    case "ANNOTATE_SLIDE_PREVIEW_DOC_DATA_REQ_EVENT":
    case "annotateLiveNotesRequestEvent":
    case "annotateUpdateAnnotationsAllowed":
      lc(a, b);
      break;
    case "annotateShowHideDocAnnotations":
    case "annotateSlideChangeSyncEvent":
    case "CHECK_BEFORE_NOTES_VIEWER_ACTION_TO_PREVIEW":
    case "HANDLE_RECORDING_BEFORE_PREVIEW_NAVIGATE_JUMP":
      lc(a, b);
      break;
    case "AnnotationPreviewActiveSlideChanged":
    case "ANNOTATE_SLIDE_PREVIEW_DOC_DATA_RES_EVENT":
      a.isParentIFrame ? kc(b.tab.id, a) : G(b.tab.id, a);
      break;
    case "HANDLE_RECORDING_BEFORE_PREVIEW_NAVIGATE_JUMP_RESPONSE":
    case "CHECK_BEFORE_NOTES_VIEWER_ACTION_FROM_PREVIEW":
    case "AnnotateFeedbackDocUpdated":
    case "ANNOTATE_CURRENT_ANNOTATIONS_SHOW_HIDE_CHANGED":
    case "annotateLiveNotesResponseEvent":
    case "annotateSlideToPresentationEvent":
    case "annotateSlideFromPresentationEvent":
    case "iframewebannotationdocsloaded":
      G(b.tab.id, a);
      break;
    case "UNLOAD_NOTES_REVIEW_PANEL_IN_SLIDES_EDIT_MODE":
      G(b.tab.id, a, {frameId:0});
      break;
    case "annotateLoadGoogleSlides":
      return mc(a, b, c), !0;
    case "annotateReloadGoogleSlides":
      a.type = "annotateLoadGoogleSlides";
      G(b.tab.id, a);
      break;
    case "checkIsFullScreenOnBaseFrame":
      return nc(a, b, c), !0;
    case "AuthTokenForBaseFrame":
      G(b.tab.id, a, {frameId:0});
      break;
    case "annotateSendAuthToken":
      ta && ta(a);
      break;
    case "annotateRegenerateAuthToken":
      sa && sa();
      break;
    case "annotateRetryAuthForPresentation":
      G(b.tab.id, a, {frameId:0});
      break;
    case "annotateClosePresentationTab":
      oc(b);
      break;
    case "annotateJumpToTabOrRedirect":
      pc(a.strTargetTabUrl, b);
      break;
    case "gotAuthTokenError":
      a.errType && 4 == a.errType && G(b.tab.id, a);
      break;
    case "AnnotateGetDrivePDFInfoFromName":
      qc(a, b);
      break;
    case "AnnotateLaunchDrivePDFInPDFViewer":
      rc(a);
      break;
    case "annotateLoadStudentNotesAnnotations":
      return Ka(a, c, b), !0;
    case "SendRequestToServer":
      return sc(a, c), !0;
    case "ANNOTATE_REQ_SLIDE_THUMBNAIL_DATA":
      return tc(a, b, c);
    case "SendDiscardMediaRequestOnServer":
      uc(a);
      break;
    case "SendRequestToDeleteAssessmentNotebook":
      vc(a);
      break;
    case "chromeExtensionServerRequest":
      return da(a, b, c), !0;
    case "annotateClosePresentationOnTabClose":
      wc(a, b);
      break;
    case "ANNOTATE_PRESENTATION_STATE_CHANGED_IN_TAB":
      xc(a, b);
      break;
    case "ANNOTATE_EVENT_SERVER_UPDATE_CONNECTION_STATE":
      yc(a, b);
      break;
    case "ANNOTATE_EVENT_SERVER_GET_CONNECTION_STATE":
      return zc(b, c), !0;
    case "ANNOTATE_EVENT_SERVER_MSG_FORWARD_TO_OTHER_TAB":
      Ac(a, b);
      break;
    case "ANNOTATE_EVENT_SERVER_MSG_FORWARD_TO_ALL_TAB":
      a.packet && (4000 == a.packet.packetSubType && "bCCLConnected" in a.packet ? w({bCCLConnected:a.packet.bCCLConnected}) : 4001 == a.packet.packetSubType && "bWebConnected" in a.packet && (w({bWebConnected:a.packet.bWebConnected}), pb()));
      P(a);
      break;
    case "AnnotateCheckLoginState":
      N(!1);
      break;
    case "AnnotateCheckLogout":
      ib();
      break;
    case "annotateClosePresentationRequest":
      return ha(a, c), !0;
    case "ANNOTATE_REQ_UPDATE_FILE_LOCK_OWNER":
      ia(a, b);
      break;
    case "ANNOTATE_REQ_RENEW_FILE_LOCK":
      return ja(a, c), !0;
    case "ANNOTATE_REQ_GET_FILE_LOCK_OWNER_INFO":
      return ka(a, c), !0;
    case "REQ_UPDATE_FEATURES_USE_REQUEST":
    case "REQ_START_FEATURES_REQUEST":
      return la(a, c), !0;
    case "annotateUpdatePresentationExtraDataRequest":
      return ea(a, c), !0;
    case "ANNOTATE_REQ_STUDENT_NOTES_TAKING_CHANGED":
      Na(a);
      break;
    case "annotateLoadStudentFeedbackDoc":
      return Oa(a, c), !0;
    case "annotateStudentNotesOpenedChanged":
      w({bStudentNotesOpen:!0}).then(() => {
        Bc();
      });
      break;
    case "annotateClassDocumentOpenedResponse":
      Cc(a);
      break;
    case "annotateCheckActiveLivefeedCCLResponse":
      a.exist && (console.log("CCL Active Livefeed: marked already joined"), Dc = !0);
      break;
    case "NotifyJoinedPresentationRoom":
      Ec(a.livefeedId, a.bCCL, a.uLivefeedActivityId, b);
      break;
    case "refreshCCLActiveLivefeed":
      null != Q && (clearTimeout(Q), Q = null);
      Sb();
      break;
    case "refreshORActiveLivefeed":
      Tb();
      break;
    case "COMM_UPDATE_GRADE_WITH_ANNOTATE":
      Fc(b, a);
      break;
    case "COMM_MSG_ASSIGNMENT_RETURN":
      G(b.tab.id, a);
      break;
    case "COMM_GET_STUDENT_SUBMISSION_FOR_WEB":
      return Va(b, a, c), !0;
    case "COMM_GET_ALL_STUDENT_SUBMISSIONS_FOR_WEB":
      Ua(a, b);
      break;
    case "UploadImageToS3":
      return Gc(a, c), !0;
    case "userRedirectUrl":
      chrome.tabs.create({url:a.url});
      break;
    case "annotateGetSlidesClassroomCourseWorkInfo":
      return Hc(a.presentationId, a.bTeacher, c), !0;
    case "COMM_UPDATE_SUBMISSION_STATE":
      return Ic(a.courseWorkDetails, a.bSubmitted), !0;
    case "annotateGetGUIDForAnnotationID":
      Jc(a.arrAnnotationId, b);
      break;
    case "AnnotateCheckAndLaunchWebAssignment":
      return Kc(a, c), !0;
    case "AnnotateCheckWebAssignmentForNonAnnotateStudent":
      return Lc(a, c), !0;
    case "WebAssignmentDummyPageLoaded":
      Mc(a, b);
      break;
    case "CheckWebAssignmentLoadedInIframe":
      G(b.tab.id, {type:"CheckIfWebAssignmentLoadedInIframe", courseWorkDetails:a.courseWorkDetails}, {frameId:a.frameId});
      break;
    case "WebAssignmentLoadedInIframeSuccess":
      Nc(b);
      break;
    case "CheckAndInsertScriptForFrame":
      Oc(b);
      break;
    case "COMM_CHECK_NOTES_VERSION":
      return Wa(a, c), !0;
    case "COMM_UPDATE_COURSE_WORK_POINTS":
      Ya(a);
      break;
    case "saveBeforeOpeningNewGradingTab":
      G(b.tab.id, {type:"CheckAndSaveUnsavedChanges"}, {frameId:a.frameId});
      break;
    case "ChangesSavedInGradingIframe":
      G(b.tab.id, {type:"ChangesSavedInGradingIframe", bStudentChange:a.bStudentChange}, {frameId:0});
      break;
    case "checkNewTabGradingDocumentOpen":
      G(b.tab.id, {type:"checkNewTabGradingDocumentOpen"}, {frameId:a.frameId});
      break;
    case "ANNOTATE_SEND_DOC_OPENED":
      Pc(a, b.tab.id);
      break;
    case "COMM_SAVE_CLOSE_TAB_GRADING":
      Qc(a, b);
      break;
    case "ANNOTATE_STALE_TAB_REMOVED":
      Rc(a, b);
      break;
    case "checkAndSaveBeforeStudentChange":
      G(b.tab.id, {type:"checkAndSaveBeforeStudentChange"}, {frameId:a.frameId});
      break;
    case "ANNOTATE_UPDATE_LAST_LOAD_ANNOTS_EXTRADATA":
      La(b.tab.id, a.data);
      break;
    case "annotateLaunchExportProgressWindow":
      return Sc(a, b, c), !0;
    case "annotateCloseExportProgressWindow":
      Tc(a, b);
      break;
    case "annotateLoadSavedAnnotations":
      K(a.strGuid, b.tab.id, b, c, !1, !0, a.bSlidesPreview, a.uDocType, !1, a.uClassId, "", !1, !1, !1, a.uLivefeedType, a.extraData, !1);
      break;
    case "annotateWebAnnotationLivefeed":
      Eb(a);
      break;
    case "annotateHideJoinLivefeedNotification":
      P({type:"ANNOTATE_CLOSE_JOIN_DB_ON_END_LIVEFEED_NOTIFICATION"});
      break;
    case "annotateLivefeedUserEvents":
      return Uc(a, c), !0;
    case "ANNOATATE_INITIATED_OPEN_WA_LF_BY_TEACHER":
      P({type:"ANNOATATE_INITIATED_OPEN_WA_LF_BY_TEACHER", LivefeedInfo:a.LivefeedInfo});
  }
  c({received:!0, from:"background"});
  return !1;
});
function Cb() {
  A(["LastORLivefeedTabData"], a => {
    if (a = a.LastORLivefeedTabData) {
      let b = !1;
      a.message && (b = !0);
      Vc({type:"extORLivefeedState", bAvailable:b, message:a.message});
    }
  });
}
function Sc(a, b, c) {
  chrome.windows.create({type:"popup", url:"exportProgress.html", height:parseInt(a.height), width:parseInt(a.width), top:parseInt(a.top), left:parseInt(a.left)}, e => {
    let d = e.id;
    A(["mapExportInProgressTab"], f => {
      f = f.mapExportInProgressTab;
      f[b.tab.id] = d;
      w({mapExportInProgressTab:f});
      c({windowId:d});
    });
  });
}
function Tc(a, b) {
  A(["mapExportInProgressTab"], c => {
    c = c.mapExportInProgressTab;
    delete c[b.tab.id];
    w({mapExportInProgressTab:c});
  });
  chrome.windows.remove(a.windowId);
}
function kb(a) {
  A(["mapExportInProgressTab"], b => {
    b = b.mapExportInProgressTab;
    let c = b[a];
    delete b[a];
    c && w({mapExportInProgressTab:b}).then(() => {
      chrome.windows.remove(c);
    });
  });
}
function Wc(a) {
  A(["toolbarPositionForTab"], b => {
    b = b.toolbarPositionForTab;
    delete b[a];
    w({toolbarPositionForTab:b});
  });
}
function Xc(a) {
  A(["mapExportInProgressTab"], b => {
    b = b.mapExportInProgressTab;
    for (let c in b) {
      if (b[c] == a) {
        delete b[c];
        G(parseInt(c), {type:"ANNOTATE_CANCEL_EXPORTING"}, {frameId:0});
        break;
      }
    }
    w({mapExportInProgressTab:b});
  });
}
function Jc(a, b) {
  a = p({uService:2357, arrAnnotationId:a});
  r(a, "POST", "/request.php", (c, e) => {
    e && c && c.oResponse && (console.log("GUID response"), console.log(c), G(b.tab.id, {type:"annotateGetGUIDForAnnotationID", annotationGuidMap:c.oResponse.annotationGuidMap}));
  });
}
function Zb(a) {
  A(["loginResponse"], b => {
    b = b.loginResponse;
    if (b.arrWebAnnotations) {
      let c = b.arrWebAnnotations.find(e => e.strGUID == a.strGUID);
      c && ("uExportPDFStatus" in a && (c.uExportPDFStatus = a.uExportPDFStatus, 0 < a.uExportPDFStatus && (c.uExportingStage = 0)), "strPDFDownloadLink" in a && (c.strPDFDownloadLink = a.strPDFDownloadLink), "uExportedPDFVersionNo" in a && (c.uExportedPDFVersionNo = a.uExportedPDFVersionNo), "uExportingStage" in a && (c.uExportingStage = a.uExportingStage), w({loginResponse:b}).then(() => {
        I(!1);
      }));
    }
  });
}
function wb(a) {
  "annotateAnnotationModeGot" in a && xb(a.annotateAnnotationModeGot);
  "annotateMinimizeModeUpdated" in a && yb(a.annotateMinimizeModeUpdated);
  "annotateAllowMinimizeModeDrawingUpdated" in a && zb(a.annotateAllowMinimizeModeDrawingUpdated);
}
function xb(a) {
  let b = null;
  a ? b = {bAnnotationMode:!0, bShowFloatingButtons:!0} : b = {bAnnotationMode:!1};
  w(b).then(() => {
    I(!0, !1, !0);
    Ea();
  });
}
function yb(a) {
  let b = null;
  b = a ? {bHideWhenMinimize:!0, bShowFloatingButtons:!1} : {bHideWhenMinimize:!1, bShowFloatingButtons:!0};
  w(b).then(() => {
    I(!1);
    Yc();
  });
}
function zb(a) {
  w({bAllowDrawingWhenMinimize:a ? !0 : !1}).then(() => {
    I(!1);
    Zc();
  });
}
var Gc = (a, b) => {
  let c = a.data.arrImgData;
  var e = a.data.mediaData;
  if (a.bForPDF) {
    e = p({bForPDF:a.bForPDF, arrAttachments:a.data.arrAttachments}), r(e, "POST", "/uploadmediathumbnail", d => {
      console.log(d);
      b({type:"UploadImageToS3Response", res:d ? d.oResponse : null});
    });
  } else if (e) {
    a = p({mediaData:e.mediaData,});
    let d = e.nPacketIndex;
    r(a, "POST", "/uploadmediathumbnail", (f, g) => {
      console.log(f);
      b({type:"UploadImageToS3Response", res:f, success:g, nPacketIndex:d});
    });
  } else {
    c && (e = p({uService:2321, arrImageData:c,}), r(e, "POST", "/zpaduserrequest.php", (d, f) => {
      b({type:"UploadImageToS3Response", res:d, success:f});
    }));
  }
}, Hc = (a, b, c) => {
  var e = p({uService:2279});
  r(e, "POST", "/zpaduserrequest.php", (d, f) => {
    f ? $c(a, b, c) : c({type:"courseworkDetailsSuccess", error:!0});
  });
}, $c = (a, b, c) => {
  var e = "/request.php";
  b || (e = "/zpadstudentrequest.php");
  a = {uService:2285, strGoogleFileId:a};
  let d = p(a);
  b || (d = q(a));
  r(d, "POST", e, (f, g) => {
    g ? c({type:"courseworkDetailsSuccess", courseWorkDetails:f.oResponse.courseWorkDetails}) : c({type:"courseworkDetailsSuccess", error:!0, strErrorDesc:f});
  });
}, ad = (a, b) => {
  a = p({uService:2285, strGoogleFileId:a});
  r(a, "POST", "/request.php", (c, e) => {
    e ? (console.log("success gclass coursework", c.oResponse), b({type:"courseworkDetailsSuccess", courseWorkDetails:c.oResponse.courseWorkDetails[0]})) : (console.log("failure gclass REQ_GET_COURSE_WORK_DETAILS", c), b({type:"courseworkDetailsSuccess", error:!0, strErrorDesc:c}));
  });
}, Ic = (a, b) => {
  a = q({uService:2333, uAssignmentid:a.id, strGoogleCourseSubmissionId:a.strGoogleCourseSubmissionId, bSubmitted:b});
  r(a, "POST", "/zpadstudentrequest.php", (c, e) => {
    e ? console.log("Google assignment status update success") : console.log("Google assignment status update failure");
  });
};
function rb(a, b) {
  chrome.webNavigation.getAllFrames({tabId:a}).then(c => {
    if (c) {
      let d = null;
      for (var e = 0; e < c.length; e++) {
        if (b == c[e].frameId) {
          d = c[e].url;
          break;
        }
      }
      for (e = 0; e < c.length; e++) {
        let f = c[e];
        0 != f.frameId && d && G(a, {type:"iframeinitialized", frameId:b, url:d}, {frameId:f.frameId});
      }
    }
  });
}
function sb(a, b) {
  chrome.webNavigation.getAllFrames({tabId:a}).then(c => {
    if (c) {
      for (var e = 0; e < c.length; e++) {
        let d = c[e];
        if (b == d.frameId) {
          G(a, {type:"iframeinitialized", frameId:b, url:d.url});
          break;
        }
      }
    }
  });
}
function lc(a, b) {
  var c = a.frameId, e = b.tab.id;
  chrome.webNavigation.getAllFrames({tabId:e}).then(d => {
    if (d) {
      for (var f = 0; f < d.length; f++) {
        let g = d[f];
        try {
          c == g.frameId && (console.log("To IFrame", a.type, a.frameId), g.url && -1 != g.url.indexOf("/preview") && G(e, a, {frameId:g.frameId}));
        } catch (h) {
        }
      }
    }
  });
}
function gc(a, b) {
  b.tab && !S(b.tab.url) || chrome.webNavigation.getAllFrames({tabId:b.tab.id}).then(c => {
    if (c) {
      for (var e = 0; e < c.length; e++) {
        let d = c[e];
        try {
          b.frameId != d.frameId && 0 != d.url.indexOf("about:") && G(b.tab.id, a, {frameId:d.frameId});
        } catch (f) {
        }
      }
    }
  });
}
function cc(a, b) {
  A(["toolbarPositionForTab"], c => {
    c = c.toolbarPositionForTab;
    c[b.tab.id] = a;
    w({toolbarPositionForTab:c}).then(() => {
      gc({type:"annotateSavedToolbarPosition", position:a.position}, b);
    });
  });
}
function dc(a, b) {
  a && a.tab && A(["toolbarPositionForTab"], c => {
    (c = c.toolbarPositionForTab[a.tab.id]) && b({type:"annotateSavedToolbarPosition", position:c});
  });
}
function ac() {
  var a = {type:"AnnotateClosePopup"}, b = chrome.runtime.sendMessage(a);
  b && b.then(() => {
  }).catch(c => console.log(c, a.type));
}
function Lb() {
  chrome.tabs.create({active:!1, url:"https://annotate.net/login.php"}, function() {
  });
}
function Ib() {
  chrome.tabs.query({url:"https://annotate.net/*"}, function(a) {
    if (0 < a.length) {
      for (var b = 0; b < a.length; b++) {
        if (a[b].url.startsWith("https://annotate.net/instructor") || a[b].url.startsWith("https://annotate.net/student")) {
          a = a[b];
          chrome.windows.update && chrome.windows.update(a.windowId, {focused:!0});
          chrome.tabs.update(a.id, {active:!0});
          return;
        }
      }
    }
    chrome.tabs.create({active:!0, url:"https://annotate.net/login.php"}, function() {
    });
  });
}
function Jb(a, b, c) {
  chrome.tabs.get(a, function(e) {
    e = e.windowId;
    chrome.windows.update && chrome.windows.update(e, {focused:!0});
    chrome.tabs.update(a, {active:!0});
  });
  b && chrome.tabs.remove(c, function() {
  });
}
chrome.tabs.onCreated.addListener(function(a) {
  console.log("tab created", a.id, a.url);
  A(["bMarkNewTabLivefeedLaunchOnTabCreate", "loginResponse"], b => {
    var c = b.loginResponse;
    c = c && c.ChromeClientLogin;
    b.bMarkNewTabLivefeedLaunchOnTabCreate && (T && (c && R(T, a.id), b = null, T.ActiveLivefeedForCCL ? b = T.ActiveLivefeedForCCL.livefeedId : T.evtData ? b = T.evtData.livefeedId : T.livefeedId && (b = T.livefeedId), b && bd(b, -1, a.id)), c && (console.log("onCreated - uTabIdLivefeedLaunchForCCL", a.id), cd(a.id)), U(!1));
  });
});
function bd(a, b, c) {
  A(["mapLivefeedTab"], e => {
    e = e.mapLivefeedTab;
    let d = Object.keys(e);
    for (let f = 0; f < d.length; f++) {
      e[d[f]].tabId == c && delete e[d[f]];
    }
    e[a] = {tabId:c, uLivefeedActivityId:b};
    console.log("mapLivefeedTab - on createTab/connected", e);
    w({mapLivefeedTab:e});
  });
}
function Ec(a, b, c, e) {
  console.log("OnJoinedPresentationRoomNotification", e.tab.id);
  e && e.tab && (b ? A(["uTabIdLivefeedLaunchForCCL", "LastCCLLivefeedTabData"], d => {
    let f = d.uTabIdLivefeedLaunchForCCL;
    e.tab.id == f ? (console.log("OnJoinedPresentationRoomNotification - uTabIdLivefeedLaunchForCCL", f, "--\x3e", -1), cd(-1)) : (d = d.LastCCLLivefeedTabData, null != d.message && R(d.message, e.tab.id), a && bd(a, -1, e.tab.id));
  }) : a && bd(a, c, e.tab.id));
}
var dd = [];
chrome.tabs.onUpdated.addListener(function(a, b, c) {
  console.log("tab updated", a, b);
  if (b.url && "" != b.url && -1 != b.url.indexOf("docs.google.com/presentation/d/")) {
    var e = {type:"annotateCurrentPageUrl"};
    e.pageData = {url:c.url, title:c.title, height:c.height, width:c.width};
    if (!S(c.url)) {
      return;
    }
    (e = chrome.tabs.sendMessage(a, e, null)) && e.then(() => {
    }).catch(d => console.log(d));
  }
  "loading" == b.status && (b.url || void 0 == c.url || -1 != dd.indexOf(a) || (console.log("Tab refresh detected - ", a, c.url), A(["mapLastLoadAnnotationReqForTab"], d => {
    d = d.mapLastLoadAnnotationReqForTab;
    void 0 != d[a] ? (L.find(f => f.tabId == a) || L.push(d[a]), console.log("Will Load annotation on refresh", a)) : console.log("No annotation to load on refresh", a);
  })), -1 == dd.indexOf(a) && dd.push(a), ed());
  "complete" == b.status && (b = dd.indexOf(a), -1 != b && dd.splice(b, 1), fd());
});
function ub() {
  var a = {type:"annotateCurrentPageUrl"};
  chrome.tabs.query({currentWindow:!0, active:!0}, function(b) {
    if (b.length) {
      var c = b[0];
      S(c.url) && (a.pageData = {url:c.url, title:c.title, height:c.height, width:c.width}, (b = chrome.tabs.sendMessage(c.id, a, null)) && b.then(() => {
      }).catch(e => console.log(e, c.url, c.id)));
    }
  });
}
function gd(a, b, c) {
  fetch("https://slides.googleapis.com/v1/presentations/" + a + "?key=AIzaSyDD86l4z0hsYHs46eon2lSOqhgYI-vGIEo", {method:"GET", async:!0, headers:{Authorization:"Bearer " + b, "Content-Type":"application/json"}, contentType:"json"}).then(function(e) {
    if (200 != e.status) {
      throw Error("could not get success");
    }
    return e.json();
  }).then(function(e) {
    c(null, e);
  }).catch(e => {
    c(e, null);
  });
}
function hd(a, b, c, e) {
  A(["accessToken", "bAccountSwitched", "googleUserId"], () => {
    fetch("https://slides.googleapis.com/v1/presentations/" + a + "/pages/" + b + "/thumbnail?key=AIzaSyDD86l4z0hsYHs46eon2lSOqhgYI-vGIEo&thumbnailProperties.mimeType=PNG&thumbnailProperties.thumbnailSize=MEDIUM", {method:"GET", async:!0, headers:{Authorization:"Bearer " + c, "Content-Type":"application/json"}, contentType:"json"}).then(function(d) {
      if (200 != d.status) {
        throw Error("could not get success");
      }
      return d.json();
    }).then(function(d) {
      e(null, d);
    }).catch(function(d) {
      e(d, null);
    });
  });
}
function qc(a, b) {
  a.accessToken && "" != a.accessToken ? id(a.name, a.accessToken, function(c, e) {
    var d = {type:"annotateDrivePDFInfoFromName", bForImport:a.bForImport};
    c || e.error ? (d.bSuccessful = !1, d.bGetTokenError = !1, G(b.tab.id, d)) : jd(e.files, a.accessToken, function(f) {
      f ? (d.bSuccessful = !1, d.bGetTokenError = !1) : (d.bSuccessful = !0, d.files = e.files);
      G(b.tab.id, d);
    });
  }) : G(b.tab.id, {type:"annotateDrivePDFInfoFromName", bForImport:a.bForImport, bSuccessful:!1, bGetTokenError:!0});
}
function jd(a, b, c) {
  var e = a.length, d = 0;
  if (1 >= e) {
    c();
  } else {
    for (var f = 0; f < e; f++) {
      a[f].parents ? kd(a[f], a[f].parents[0], b, function(g) {
        g ? c(g) : (d++, d == e && c());
      }) : (d++, d == e && c());
    }
  }
}
function kd(a, b, c, e) {
  var d = a.filePath ? a.filePath : "";
  fetch("https://www.googleapis.com/drive/v3/files/" + b + "?fields=*&key=AIzaSyDD86l4z0hsYHs46eon2lSOqhgYI-vGIEo", {method:"GET", async:!0, headers:{Authorization:"Bearer " + c, "Content-Type":"application/json"}, contentType:"json"}).then(f => f.json()).then(function(f) {
    d = f.name + "/" + d;
    a.filePath = d;
    f.parents ? kd(a, f.parents[0], c, e) : e(null);
  }).catch(f => {
    e(f);
  });
}
function id(a, b, c) {
  b = {method:"GET", async:!0, headers:{Authorization:"Bearer " + b, "Content-Type":"application/json"}, contentType:"json"};
  fetch("https://www.googleapis.com/drive/v3/files?q=" + encodeURIComponent("name='" + a + "'") + "&fields=*&key=AIzaSyDD86l4z0hsYHs46eon2lSOqhgYI-vGIEo", b).then(e => e.json()).then(function(e) {
    c(null, e);
  }).catch(e => {
    c(e, null);
  });
}
function rc(a) {
  a = "https://annotate.net/docs/viewer?state=" + encodeURIComponent(JSON.stringify({ids:[a.fileId]}));
  chrome.tabs.create({active:!0, url:a}, function() {
  });
}
function Kc(a, b) {
  console.log(">>>> CheckAndLaunchWebAssignment", a);
  ad(a.fileId, b);
}
function Lc(a, b) {
  a = p({uService:2377, strGoogleFileId:a.fileId});
  r(a, "POST", "/request.php", (c, e) => {
    e ? (console.log("success gclass REQ_GET_COURSE_WORK_DETAILS_NON_ANNOTATE_STUDENT", c.oResponse), b({type:"courseworkDetailsSuccess", courseWorkDetails:c.oResponse.courseWorkDetails[0]})) : (console.log("failure gclass REQ_GET_COURSE_WORK_DETAILS_NON_ANNOTATE_STUDENT", c), b({type:"courseworkDetailsSuccess", error:!0, strErrorDesc:c}));
  });
}
function Mc(a, b) {
  console.log(">>>>> load msg received", a);
  console.log(b);
  G(b.tab.id, {type:"LoadWebpageAssignmentInGradingIframe", frameId:b.frameId}, {frameId:0});
}
function Nc(a) {
  console.log("WebAssignmentLoadedInIframeSuccess", a);
  G(a.tab.id, {type:"WebAssignmentLoadedInIframeSuccess"}, {frameId:0});
}
function Qc(a, b) {
  let c = b.tab.id, e = b.frameId;
  chrome.tabs.get(a.tabId, function(d) {
    d ? G(a.tabId, {type:"COMM_SAVE_CLOSE_TAB_GRADING", newTabId:c, newTabFrameId:e}, {frameId:0}) : G(e, {type:"ANNOTATE_STALE_TAB_REMOVED"}, {frameId:e});
  });
}
function Rc(a, b) {
  chrome.tabs.remove(b.tab.id, function() {
  });
  "newTabFrameId" in a ? G(a.newTabId, {type:"ANNOTATE_STALE_TAB_REMOVED"}, {frameId:a.newTabFrameId}) : G(a.newTabId, {type:"ANNOTATE_STALE_TAB_REMOVED"});
}
function db(a) {
  chrome.tabs.query({currentWindow:!0, active:!0}, function(b) {
    b.length && (b = b[0], S(b.url) && (b = chrome.tabs.sendMessage(b.id, a, null)) && b.then(() => {
    }).catch(c => console.log(c)));
  });
}
function P(a) {
  chrome.tabs.query({}, function(b) {
    for (var c = 0; c < b.length; c++) {
      if (S(b[c].url)) {
        a.selfTabId = b[c].id;
        var e = chrome.tabs.sendMessage(b[c].id, a, null);
        e && e.then(() => {
        }).catch(d => console.log(d));
      }
    }
  });
}
function Eb(a) {
  chrome.tabs.query({}, function(b) {
    for (var c = 0; c < b.length; c++) {
      if (qb(b[c].url)) {
        var e = chrome.tabs.sendMessage(b[c].id, a, null);
        e && e.then(() => {
        }).catch(d => console.log(d));
      }
    }
  });
}
function Fb(a, b) {
  var c = {};
  if (a.bForSave || a.bForAssessment) {
    c = {format:"png"};
  }
  a.bForClipThumb && (c = {format:"png"});
  a.bForExport && (c = {format:"png"});
  chrome.tabs.captureVisibleTab(a.windowId ? a.windowId : chrome.windows.WINDOW_ID_CURRENT, c, function(e) {
    b({type:"annotateScreenShotDataGot", data:e, x:a.x, y:a.y, width:a.width, height:a.height, bForSave:a.bForSave, bForAssessment:a.bForAssessment, saveRequestData:a.saveRequestData, bForClipThumb:a.bForClipThumb, bForExport:a.bForExport});
  });
}
function nc(a, b, c) {
  var e = chrome.tabs.sendMessage(b.tab.id, a, {frameId:0});
  e && e.then(d => {
    c(d);
  }).catch(d => {
    console.log(d, a.type, b.tab.id);
  });
}
function G(a, b, c) {
  var e = chrome.tabs.sendMessage(a, b, c);
  e && e.then(() => {
  }).catch(d => {
    console.log(d, b.type, a, c);
  });
}
function kc(a, b) {
  chrome.webNavigation.getAllFrames({tabId:a}).then(c => {
    if (c) {
      for (var e = 0; e < c.length; e++) {
        let d = c[e];
        0 != d.frameId && G(a, b, {frameId:d.frameId});
      }
    }
  });
}
function ld(a, b, c, e, d) {
  var f = a.url;
  if (a.bPDFViewerInGoogleDrive && (f = "https://www.googleapis.com/drive/v3/files/" + a.strFileId + "?alt=media&key=AIzaSyDD86l4z0hsYHs46eon2lSOqhgYI-vGIEo", !a.accessToken || "" == a.accessToken)) {
    b();
    return;
  }
  b = {"Content-type":"application/x-www-form-urlencoded"};
  a.bPDFViewerInGoogleDrive && (b.Authorization = "Bearer " + a.accessToken);
  fetch(f, {method:"GET", headers:b}).then(g => c(g)).then(g => {
    d && d(g);
  }).catch(g => {
    e && e(g);
  });
}
function Hb(a, b) {
  ld(a, function() {
    b({type:"annotateCheckPDFExistsOnDrive", bSuccessful:!1});
  }, function(c) {
    b(200 != c.status ? {type:"annotateCheckPDFExistsOnDrive", bSuccessful:!1,} : {type:"annotateCheckPDFExistsOnDrive", bSuccessful:!0,});
  }, function() {
    b({type:"annotateCheckPDFExistsInDrive", bSuccessful:!1,});
  }, null);
}
function Gb(a, b, c) {
  function e() {
    c({type:"annotateDrivePDFInfoFromDOM", bForImport:!0, bSuccessful:!1, bGetTokenError:!0, strFileId:a.strFileId});
  }
  let d = !1;
  ld(a, e, function(f) {
    if (200 != f.status) {
      d = !0, e();
    } else {
      return f.blob();
    }
  }, function() {
    c({type:"annotateImportPDFFailed"});
  }, function(f) {
    f ? md(f, a, b, c) : d || c({type:"annotateImportPDFFailed"});
  });
}
function md(a, b, c, e) {
  var d = a.size;
  a = new File([a], "importFile.pdf");
  var f = new FileReader();
  f.readAsDataURL(a);
  f.onload = function() {
    b.fileData = f.result;
    b.fileSize = d;
    G(c.tab.id, {type:"annotateStartImportPdfTimer", fileSize:b.fileSize});
    Eb({type:"annotateImportPdf", url:b.url, pageRange:b.pageRange, filename:b.filename, fileData:b.fileData, tabId:c.tab.id});
    e({bSuccess:!0});
  };
  f.onerror = function() {
    e({type:"annotateImportPdfFailed"});
  };
}
function Db(a) {
  chrome.tabs.captureVisibleTab(function(b) {
    Eb({type:"annotateScreenShotGot", data:b, x:a.x, y:a.y, width:a.width, height:a.height, bNewPage:a.bNewPage, windowWidth:a.windowWidth, windowHeight:a.windowHeight});
  });
}
function eb(a) {
  var b = !1, c = a.srcUrl;
  if (c.startsWith("http://") || c.startsWith("https://")) {
    b = !0;
  }
  var e = {type:"annotateHighlightSelectedImagePosted"};
  chrome.tabs.query({currentWindow:!0, active:!0}, function(d) {
    d.length && (d = d[0], S(d.url) && (d = chrome.tabs.sendMessage(d.id, e, null)) && d.then(() => {
    }).catch(f => console.log(f)));
  });
  Eb({type:"annotateSelectedImageGot", data:a, selectedImage:!0, bImageUrl:b});
}
function qb(a) {
  return a ? -1 != a.indexOf("https://annotate.net/login") || -1 != a.indexOf("https://annotate.net/instructor") || -1 != a.indexOf("https://annotate.net/student") || -1 != a.indexOf("https://annotate.net/ChromeClient") || -1 != a.indexOf("https://annotate.net/ChromeExtension") || -1 != a.indexOf("https://annotate.net/account") || -1 != a.indexOf("https://annotate.net/openroomextension.php") || -1 != a.indexOf("https://annotate.net/ORIndex") || ob(a) : !1;
}
function ob(a) {
  return a ? -1 != a.indexOf("https://annotate.net/ChromeClient") || -1 != a.indexOf("https://annotate.net/CCL") || -1 != a.indexOf("https://annotate.net/ChromeClientLite") : !1;
}
function nd(a) {
  return a ? -1 != a.indexOf("https://annotate.net/ORIndex.php") : !1;
}
function I(a, b, c) {
  qa(e => {
    null != e.bCCLConnected && e.loginResponse && (e.loginResponse.bCCLConnected = e.bCCLConnected);
    null != e.bWebConnected && e.loginResponse && (e.loginResponse.bWebConnected = e.bWebConnected, pb());
    var d = e.loginResponse;
    gb(d && 0 == d.bUserType && e.bShowHighlight);
    d && 4 == d.uUserType && (e.bAnnotationMode = !1);
    chrome.tabs.query({}, function(f) {
      for (var g = 0; g < f.length; g++) {
        if (S(f[g].url)) {
          var h = chrome.tabs.sendMessage(f[g].id, {type:"AnnotateLoginResponsePlugin", data:d, bShowHighlight:e.bShowHighlight, bAnnotatePage:qb(f[g].url), bAnnotationMode:e.bAnnotationMode, bHideWhenMinimize:e.bHideWhenMinimize, bAllowDrawingWhenMinimize:e.bAllowDrawingWhenMinimize, bShowFloatingButtons:e.bShowFloatingButtons, bStylusModeAsked:e.bStylusModeAsked, bStylusMode:e.bStylusMode, bGoogleDrivePermissionAccepted:e.bGoogleDrivePermissionAccepted, bShowGoogleSlideFeatureUpdateDialog:e.bShowGoogleSlideFeatureUpdateDialog, 
          bShowAnnotationSavedMsg:e.bShowAnnotationSavedMsg, bShowDeleteAllWarning:e.bShowDeleteAllWarning, bStudentNotesOpen:e.bStudentNotesOpen, bGradeWithAnnotate:e.bGradeWithAnnotate, serverUrl:"https://annotate.net", isIOSExtension:!1, PDFViewerUrl:"https://annotate.net/docs/viewer", bShowError:a, bAnnotationModeUpdate:c, googleUserId:e.googleUserId, accessToken:e.accessToken}, null);
          h && h.then(() => {
          }).catch(l => console.log(l));
        }
      }
    });
    b && chrome.tabs.query({currentWindow:!0, active:!0}, function(f) {
      (f = f[0]) && S(f.url) && (f = chrome.tabs.sendMessage(f.id, {type:"AnnotateLoginResponsePlugin", data:d, bShowHighlight:e.bShowHighlight, bAnnotatePage:f && f.url && qb(f.url), bAnnotationMode:e.bAnnotationMode, bHideWhenMinimize:e.bHideWhenMinimize, bAllowDrawingWhenMinimize:e.bAllowDrawingWhenMinimize, bShowFloatingButtons:e.bShowFloatingButtons, bStylusModeAsked:e.bStylusModeAsked, bStylusMode:e.bStylusMode, bGoogleDrivePermissionAccepted:e.bGoogleDrivePermissionAccepted, bShowGoogleSlideFeatureUpdateDialog:e.bShowGoogleSlideFeatureUpdateDialog, 
      bShowAnnotationSavedMsg:e.bShowAnnotationSavedMsg, bShowDeleteAllWarning:e.bShowDeleteAllWarning, serverUrl:"https://annotate.net", isIOSExtension:!1, PDFViewerUrl:"https://annotate.net/docs/viewer", bShowError:a, bShowNotLoggedInDialog:!0, googleUserId:e.googleUserId, accessToken:e.accessToken}, null)) && f.then(() => {
      }).catch(g => console.log(g));
    });
  });
}
function Mb(a) {
  A(["loginResponse", "arrClickData"], b => {
    var c = b.loginResponse;
    null != c && 2 == c.uUserType && (c = {strButtonId:a.btnId, dtTimeStamp:od()}, (b = b.arrClickData) || (b = []), b.push(c), w({arrClickData:b}).then(() => {
      pd();
    }));
  });
}
function od() {
  var a = new Date(), b = a.getUTCDate(), c = a.getUTCMonth() + 1, e = a.getUTCHours(), d = a.getUTCMinutes(), f = a.getUTCSeconds();
  return a.getUTCFullYear() + "-" + (10 > c ? "0" + c : c) + "-" + (10 > b ? "0" + b : b) + " " + (10 > e ? "0" + e : e) + ":" + (10 > d ? "0" + d : d) + ":" + (10 > f ? "0" + f : f);
}
function qd(a, b) {
  for (var c = [], e = 0; e < a.length; e++) {
    c.push(a[e]), b.push(a[e]);
  }
  a.splice(0, a.length);
  w({arrClickData:[], arrTempClickData:b});
  return {uService:2187, arrClickInfo:c};
}
function rd() {
  A(["loginResponse", "arrClickData", "arrTempClickData"], a => {
    var b = a.arrClickData, c = a.arrTempClickData;
    if (null != a.loginResponse) {
      if (Za) {
        pd();
      } else {
        if (b && 0 != b.length) {
          a = qd(b, c);
          a = p(a);
          a = "requestdata=" + JSON.stringify(a);
          Za = new AbortController();
          var e = setTimeout(() => {
            Za.abort();
          }, 30000);
          fetch("https://annotate.net/zpaduserrequest.php", {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, signal:Za.signal, body:a}).then(d => {
            clearTimeout(e);
            Za = null;
            return d.text();
          }).then(d => {
            try {
              var f = JSON.parse(d);
              f ? f.oResponse && f.oResponse.bSuccessful ? w({arrTempClickData:[]}).then(() => {
              }) : f.uErrorNo && 1 == f.uErrorNo ? w({arrTempClickData:[]}).then(() => {
                N(!0);
              }) : f.uErrorNo && 21 == f.uErrorNo ? (console.log("error 21"), aa(!1, null, "", "", sd)) : sd() : sd();
            } catch (g) {
              sd();
            }
          }).catch(() => {
            clearTimeout(e);
            Za = null;
            sd();
          });
        }
      }
    }
  });
}
function sd() {
  A(["arrClickData", "arrTempClickData"], a => {
    var b = a.arrClickData;
    a = a.arrTempClickData;
    for (var c = a.length - 1; 0 <= c; c--) {
      b.unshift(a[c]);
    }
    w({arrClickData:b, arrTempClickData:a}).then(() => {
      pd();
    });
  });
}
function pd() {
  chrome.alarms.create("sendClickStream", {delayInMinutes:1});
}
chrome.alarms.onAlarm.addListener(function(a) {
  "sendClickStream" == a.name ? (chrome.alarms.clear("sendClickStream"), rd()) : "checkforupdate" == a.name && fb();
});
function Ab() {
  var a = p({uService:837, uStylusModeChangeOptionMsg:2});
  r(a, "POST", "/zpaduserrequest.php", function() {
  });
}
function sc(a, b) {
  let c = a.oRequest, e = a.ctx, d = a.url, f = null;
  f = 2 == a.uType ? p(c) : q(c);
  r(f, "POST", d, function(g, h) {
    b({type:"ReceiveResponseFromServer", ctx:e, res:g, success:h});
  });
}
function ec() {
  var a = p({uService:837, bShowGoogleSlideFeatureUpdateDialog:0});
  r(a, "POST", "/zpaduserrequest.php", function() {
  });
}
function fc() {
  var a = p({uService:837, bShowAnnotationSavedMsg:0});
  r(a, "POST", "/zpaduserrequest.php", function() {
  });
}
function Ea() {
  A(["bAnnotationMode"], a => {
    a = p({uService:837, bExtensionToolbarOpen:a.bAnnotationMode ? 1 : 0});
    r(a, "POST", "/zpaduserrequest.php", function() {
    });
  });
}
function Yc() {
  A(["bHideWhenMinimize"], a => {
    a = p({uService:837, bHideExtensionWhenMinimize:a.bHideWhenMinimize ? 1 : 0});
    r(a, "POST", "/zpaduserrequest.php", function() {
    });
  });
}
function Zc() {
  A(["bAllowDrawingWhenMinimize"], a => {
    a = p({uService:837, bAllowDrawingWhenMinimize:a.bAllowDrawingWhenMinimize ? 1 : 0});
    r(a, "POST", "/zpaduserrequest.php", function() {
    });
  });
}
function Bc() {
  A(["bStudentNotesOpen"], a => {
    a = p({uService:837, bExtensionStudentNotesOpen:a.bStudentNotesOpen ? 1 : 0});
    r(a, "POST", "/zpaduserrequest.php", function() {
    });
  });
}
function Nb(a) {
  let b = {G:!1, time:0, message:""}, c = a.oData ? a.oData : JSON.stringify(b);
  a = p({uService:2323, oData:c});
  r(a, "POST", "/zpaduserrequest.php", function(e, d) {
    d && A(["loginResponse"], f => {
      (f = f.loginResponse) && (f.strTimerSetting = c);
      w({loginResponse:f}).then(() => {
      });
    });
  });
}
function Fc(a, b) {
  var c = b.bGradeWithAnnotate;
  w({bGradeWithAnnotate:c}).then(() => {
    G(a.tab.id, {type:"classroomGradingToggled", bGradeWithAnnotate:c, bDisposeIframe:b.bDisposeIframe});
    var e = p({uService:837, bGradeWithAnnotate:c ? 1 : 0});
    r(e, "POST", "/zpaduserrequest.php", function() {
    });
  });
}
function Ob(a, b) {
  let c = {uService:713, strRecordingName:a.strClipName, uCategoryId:a.uDefaultDriveCategoryId, bPublic:0, strDesc:"", arrTags:[], bReusable:0, uParentId:a.uDefaultDriveCategoryParentId, arrClasses:[], uSubjectKeyId:0, strSubjectName:"", uRefDocId:0, uRefDocGuid:null, uClipStyle:2, uRequestId:-1, bReqFromExtension:!0};
  a = p(c);
  let e = b.tab.id;
  r(a, "POST", "/zpaduserrequest.php", function(d, f) {
    f ? (d.oResponse.sourceTabId = e, d.oResponse.createClipReq = Object.assign({}, c), td(!0, d.oResponse)) : d ? d.uErrorNo && 1 == d.uErrorNo && N(!0) : td(!1, {sourceTabId:e});
  });
}
function td(a, b) {
  var c = {type:"createClipStatus", bSuccessful:a, sourceTabId:b.sourceTabId};
  a && (c.uRecordingId = b.uRecordingId, c.strRecordingGuid = b.strGUID, c.uStatus = b.uStatus, c.createClipReqRes = Object.assign({}, b));
  P(c);
  I(!1);
}
function Pb(a, b) {
  a = p(a.oRequest);
  let c = b.tab.id;
  r(a, "POST", "/zpaduserrequest.php", function(e, d) {
    d ? (e.oResponse.sourceTabId = c, ud(!0, e.oResponse)) : e && e.oResponse ? e.oResponse && !e.oResponse.bSuccessful ? ud(!1, {sourceTabId:c}) : e.uErrorNo && 1 == e.uErrorNo && N(!0) : ud(!1, {sourceTabId:c});
  });
}
function ud(a, b) {
  P({type:"saveClipStatus", bSuccessful:a, sourceTabId:b.sourceTabId});
  I(!1);
}
function wc(a, b) {
  if (null != b && null != b.tab) {
    var c = b.tab.id, e = a.uRoomId, d = a.strUserGuid;
    a.bOnDispose ? (console.log("AutoClosePresentationOnDispose:", e, d), ma(e, d)) : (console.log("AutoClosePresentationOnCloseTab: wait 3 secs after user respods to beforeunload", e, d, c, new Date()), setTimeout(() => {
      console.log("AutoClosePresentationOnCloseTab: check if tab still exists?", c, new Date());
      chrome.tabs.get(c, () => {
        chrome.runtime.lastError ? (console.log("AutoClosePresentationOnCloseTab: (pressed leave)", chrome.runtime.lastError.message), ma(e, d)) : console.log("AutoClosePresentationOnCloseTab: (pressed cancel) abort on tab exists");
      });
    }, 3E3));
  }
}
function xc(a, b) {
  null != b && null != b.tab && A(["loginResponse", "livefeedStartedTabInfo"], c => {
    var e = c.loginResponse;
    c = c.livefeedStartedTabInfo;
    null != e && 2 == e.uUserType && (a.bStarted ? c = {tabId:b.tab.id, uRoomId:a.uRoomId, strUserGuid:a.strUserGuid, strTeacherKey:a.strTeacherKey, bOpenLivefeed:a.bOpenLivefeed, strOpenRoomId:a.strOpenRoomId ? a.strOpenRoomId : null} : c && c.tabId == b.tab.id && (c.bOpenLivefeed && oa(c.strOpenRoomId, c.strUserGuid, c.strTeacherKey), c = null), console.log("livefeed started tab list data updated ", c), w({livefeedStartedTabInfo:c}));
  });
}
function vd(a) {
  chrome.tabs.query({active:!0, currentWindow:!0}, function(b) {
    b && 0 < b.length && S(b[0].url) ? a(b[0].id) : a(null);
  });
}
function wd(a) {
  for (let b = 0; b < a.length; b++) {
    let c = a[b];
    if (4 == c.uFeatureId) {
      return "1" == c.bAllowed.toString();
    }
  }
  return !1;
}
var Q = null;
function V(a, b) {
  A(["uEventServerConnectedTabId", "loginResponse"], c => {
    let e = c.loginResponse;
    if (e) {
      if (e.arrBetaFeature && wd(e.arrBetaFeature)) {
        (c = c.uEventServerConnectedTabId) || (c = -1);
        if (b) {
          if (c != a || X == a) {
            P({type:"ANNOTATE_EVENT_SERVER_DISCONNECT_ON_OTHER_TABS", uEventServerConnectedTabId:a}), null != Q && (clearTimeout(Q), Q = null), Q = setTimeout(() => {
              Q = null;
              Sb();
            }, 5E3), Tb();
          }
          c = a;
          X == a ? (console.log("Connect to EventRoom: Connected", c), X = -1, Y = !1) : -1 != X ? (console.log("This log shouldn't have logged: different tab connected to event server", X, c), X = -1, Y = !1) : console.log("Connected to EventRoom:", c);
        } else {
          c == a ? (-1 != c && console.log("Disconnected from EventRoom", c), c = -1) : X == a && (console.log("Connect to EventRoom: Disconnected.. failed to connect on requested tab", a), X = -1, Y = !1);
        }
        console.log("uEventServerConnectedTabId ", c);
        w({uEventServerConnectedTabId:c});
        fd();
      } else {
        console.log("EVENT SERVER BETA FEATURE: NOT ALLOWED");
      }
    } else {
      console.log("User logged out. Do not connect EVENT SERVER");
    }
  });
}
function yc(a, b) {
  null != b && null != b.tab && (console.log("OnEventServerConnectionStateChangeInTab ", b.tab.id, a.bConnected), V(b.tab.id, a.bConnected));
}
function zc(a, b) {
  null != a && null != a.tab && b && A(["uEventServerConnectedTabId"], c => {
    let e = c.uEventServerConnectedTabId;
    e && -1 != e ? chrome.tabs.sendMessage(e, {type:"ANNOTATE_EVENT_SERVER_TAB_CONNECTION_STATUS"}, null, d => {
      chrome.runtime.lastError ? (console.log("get event room conn status from tab: GOT ERROR", e, chrome.runtime.lastError), b({bConnected:!1}), V(e, !1)) : d && "bConnected" in d && (console.log("get event room conn status from tab: GOT STATUS", e, d.bConnected), b({bConnected:d.bConnected}), V(e, d.bConnected));
    }) : (console.log("get event room conn status from tab: NO TAB SET", e), b({bConnected:!1}));
  });
}
function ed() {
  A(["uEventServerConnectedTabId"], a => {
    let b = a.uEventServerConnectedTabId;
    b && -1 != b ? chrome.tabs.sendMessage(b, {type:"ANNOTATE_EVENT_SERVER_TAB_CONNECTION_STATUS"}, null, c => {
      chrome.runtime.lastError ? (console.log("check event room conn status on tab: GOT ERROR", b, chrome.runtime.lastError), V(b, !1)) : c && "bConnected" in c && (console.log("check event room conn status on tab: GOT STATUS", b, c.bConnected), V(b, c.bConnected));
    }) : (console.log("check event room conn status on tab: NO TAB SET", b), fd());
  });
}
function Ac(a, b) {
  null != b && null != b.tab && vd(c => {
    chrome.tabs.query({}, function(e) {
      for (var d = 0; d < e.length; d++) {
        if ((!qb(e[d].url) || ob(e[d].url)) && b.tab.id != e[d].id) {
          "packet" in a && (a.packet.bActiveTab = e[d].id == c);
          var f = chrome.tabs.sendMessage(e[d].id, a, null);
          f && f.then(() => {
          }).catch(g => console.log(g));
        }
      }
    });
  });
}
var Y = !1, X = -1;
function fd() {
  Y ? console.log("SendMessageToConnectEventServer abort.. aleady in progress") : (Z && (clearTimeout(Z), Z = null), Y = !0, A(["uEventServerConnectedTabId", "loginResponse"], a => {
    let b = a.loginResponse;
    if (b) {
      if (b.arrBetaFeature && wd(b.arrBetaFeature)) {
        var c = a.uEventServerConnectedTabId;
        c && -1 != c ? (Y = !1, chrome.tabs.query({}, e => {
          let d = !1;
          for (var f = 0; f < e.length; f++) {
            if (e[f].id == c) {
              d = !0;
              break;
            }
          }
          d || (console.log("TAB uEventServerConnectedTabId NOT FOUND in tab list", c), V(c, !1));
        })) : chrome.tabs.query({}, function(e) {
          for (var d = 0; d < e.length; d++) {
            if (S(e[d].url) && "complete" == e[d].status) {
              var f = chrome.tabs.sendMessage(e[d].id, {type:"ANNOTATE_EVENT_SERVER_CONNECT_REQUEST"}, null);
              f && f.then(g => {
                null != g && null != g.bRequested && 1 == g.bRequested ? (console.log("Connect to EventRoom: Requested", e[d].id), X = e[d].id, setTimeout(() => {
                  e[d].id == X && (console.log("Connect to EventRoom: Request timed out", e[d].id), X = -1, Y = !1, fd());
                }, 15000)) : null != g && null != g.bRequested && 0 == g.bRequested ? (console.log("Connect to EventRoom: failed to request, retry in 3 sec...", e[d].id), Y = !1, xd()) : null != g && g.bConnected ? (console.log("Connect to EventRoom: already connected on this tab", e[d].id), Y = !1, V(e[d].id, !0)) : (Y = !1, console.log("Connect to EventRoom: Requested (may be) got default res", g, e[d].id), X = e[d].id, setTimeout(() => {
                  e[d].id == X && (console.log("Connect to EventRoom: Request timed out", e[d].id), X = -1, Y = !1, fd());
                }, 15000));
              }).catch(g => {
                console.log("Connect to EventRoom: Error, retry in 3 sec...", g, e[d].id);
                Y = !1;
                if ("active" in e[d] && !e[d].active) {
                  console.log("Connect to EventRoom: Inject script on inactive tab", e[d].id);
                  g = chrome.runtime.getManifest().content_scripts[0].js;
                  var h = chrome.runtime.getManifest().content_scripts[0].css;
                  chrome.scripting.insertCSS({target:{tabId:e[d].id, allFrames:!0}, files:h});
                  chrome.scripting.executeScript({target:{tabId:e[d].id, allFrames:!0}, files:g});
                }
                xd();
              });
              return;
            }
          }
          console.log("SendMessageToConnectEventServer.. No valid tabs found.. retry in 3 sec...");
          Y = !1;
          xd();
        });
      } else {
        Y = !1, console.log("EVENT SERVER BETA FEATURE: NOT ALLOWED");
      }
    } else {
      Y = !1, console.log("User logged out. Do not connect");
    }
  }));
}
var Z = null;
function xd() {
  Z && (clearTimeout(Z), Z = null);
  Z = setTimeout(() => {
    Z = null;
    fd();
  }, 3000);
}
function uc(a) {
  a = p({uService:2315, oImage:a.oImage, oVideo:a.oVideo});
  r(a, "POST", "/zpaduserrequest.php", function() {
  });
}
function vc(a) {
  a = p({uService:2329, strGuid:a.strGuid});
  r(a, "POST", "/zpaduserrequest.php", function() {
  });
}
function Tb() {
  A(["loginResponse"], a => {
    (a = a.loginResponse) && 4 == a.uUserType && (a = p({uService:2387, strTeacherKey:a.strOpenRoomKey,}), r(a, "POST", "/zpadopenrequest.php", function(b, c) {
      c && (b = b.oResponse, b.oWALivefeed ? (b = b.oWALivefeed, 0 == b.uLivefeedType ? Xb(Yb(b.livefeedId, {strGUID:b.strGUID, strOwnerGUID:b.strOwnerGUID, strPageUrl:b.strPageUrl, uLivefeedClassId:b.uLivefeedClassId, uLivefeedType:b.uLivefeedType})) : Xb(null)) : Xb(null));
    }));
  });
}
function Sb() {
  A(["loginResponse"], a => {
    (a = a.loginResponse) && a.ChromeClientLogin && (a = p({uService:2355, strUserGuid:a.strUserGuid, uUserType:a.uUserType,}), r(a, "POST", "/zpaduserrequest.php", function(b, c) {
      if (c) {
        if (b = b.oResponse, b.oWALivefeed) {
          b = b.oWALivefeed;
          c = b.uLivefeedType;
          if (1 == c && "strExtraData" in b && b.strExtraData) {
            if (0 == JSON.parse(b.strExtraData).bCCL) {
              console.log("CCL Active Livefeed: present to CCL is OFF (private room)");
              yd();
              return;
            }
          } else if (0 == c && "bCCL" in b && !b.bCCL) {
            console.log("CCL Active Livefeed: present to CCL is OFF (openroom)");
            yd();
            return;
          }
          zd(b);
        } else {
          yd();
        }
      }
    }));
  });
}
function yd() {
  U(!1);
  R(null, -1);
  cd(-1);
}
function Ad(a) {
  if (3 == a.uSaveAnnotationType) {
    a = Bd(a);
  } else {
    if (a.bTempAnnot) {
      if (a.bSaveAsNew) {
        var b = {uService:2343, strAnnotationData:JSON.stringify(a.annotationData), strAnnotationName:a.name, strDescription:a.description, strPageTitle:a.title, strPageUrl:a.url, uAnnotationType:a.uAnnotationType, uGoogleAssignmentSubmissionId:a.uGoogleAssignmentSubmissionId, strGoogleCourseSubmissionId:a.strGoogleCourseSubmissionId, strThumbnailData:a.thumbnail.replace("data:image/png;base64,", ""), arrMediaAdded:a.arrMediaAdded, oImageAdded:a.oImageAdded, oVideoAdded:a.oVideoAdded, oAssessmentData:a.oAssessmentData, 
        bTempAnnot:a.bTempAnnot};
        "strBaseAnnotationGuid" in a && (b.strBaseAnnotationGuid = a.strBaseAnnotationGuid);
        a = b;
      } else {
        b = {uService:2345, uAnnotationId:a.savedAnnotationId, strAnnotationData:JSON.stringify(a.annotationData), strThumbnailData:a.thumbnail.replace("data:image/png;base64,", ""), arrMediaAdded:a.arrMediaAdded, oImageAdded:a.oImageAdded, oVideoAdded:a.oVideoAdded, arrImageModels:a.arrImageModels, arrVideoModels:a.arrVideoModels, oAssessmentData:a.oAssessmentData, strTempAnnotGUID:a.strTempAnnotGUID, bTempAnnot:a.bTempAnnot}, a.uOwnerId && (b.uOwnerId = a.uOwnerId), a.bSaveAsNew && (b.strAnnotationName = 
        a.name, b.strDescription = a.description, b.strPageTitle = a.title, b.strPageUrl = a.url, b.uAnnotationType = a.uAnnotationType, b.uGoogleAssignmentSubmissionId = a.uGoogleAssignmentSubmissionId, b.strGoogleCourseSubmissionId = a.strGoogleCourseSubmissionId, b.uBaseAnnotationId = a.uBaseAnnotationId, b.uBaseAnnotationUserId = a.uBaseAnnotationUserId), a = b;
      }
    } else {
      a.bSaveAsNew ? b = "" == a.strTempAnnotGUID ? {uService:2195, strAnnotationData:JSON.stringify(a.annotationData), strAnnotationName:a.name, strDescription:a.description, strPageTitle:a.title, strPageUrl:a.url, uAnnotationType:a.uAnnotationType, uGoogleAssignmentSubmissionId:a.uGoogleAssignmentSubmissionId, strGoogleCourseSubmissionId:a.strGoogleCourseSubmissionId, strThumbnailData:a.thumbnail.replace("data:image/png;base64,", ""), arrMediaAdded:a.arrMediaAdded, oImageAdded:a.oImageAdded, oVideoAdded:a.oVideoAdded, 
      uBaseAnnotationId:a.uBaseAnnotationId, strBaseAnnotationGuid:a.strBaseAnnotationGuid ? a.strBaseAnnotationGuid : null, oAssessmentData:a.oAssessmentData} : {uService:2347, strAnnotationData:JSON.stringify(a.annotationData), strAnnotationName:a.name, strPageTitle:a.title, strPageUrl:a.url, strTempAnnotGUID:a.strTempAnnotGUID, strDescription:a.description, uAnnotationType:a.uAnnotationType, strThumbnailData:a.thumbnail.replace("data:image/png;base64,", ""), arrRecordedMedia:a.arrRecordedMedia, 
      arrRecordedCommentMedia:a.arrRecordedCommentMedia, arrVideoModels:a.arrVideoModels, arrImageModels:a.arrImageModels, oAssessmentData:a.oAssessmentData,} : b = Bd(a), a = b;
    }
  }
  return a;
}
function Qb(a, b) {
  var c = Ad(a), e = p(c);
  let d = b.tab.id, f = b.frameId, g = b.tab.windowId, h = a.uBaseAnnotationId, l = a.strBaseAnnotationGuid ? a.strBaseAnnotationGuid : null, m = a.bSaveAsNew, v = c.strAnnotationData, t = a.bTempAnnot, n = "bAnnotatePDFViewer" in a ? a.bAnnotatePDFViewer : !1, y = a.uSaveAnnotationType, x = a.strOwnerGuid, B = a.strStudentGuid, z = a.bCloseTabAfterSave;
  r(e, "POST", "/zpaduserrequest.php", function(u, E) {
    E ? (u.oResponse.uSaveAnnotationType = y, u.oResponse.strOwnerGuid = x, u.oResponse.strStudentGuid = B, u.oResponse.strAnnotationDocSaved = v, u.oResponse.bSaveAsNew = m, u.oResponse.bAnnotatePDFViewer = n, u.oResponse.saveSourceTabId = d, u.oResponse.saveSourceTabFrameId = f, u.oResponse.saveSourceTabWindowId = g, u.oResponse.bCloseTabAfterSave = z, null != h && -1 != h && (u.oResponse.uBaseAnnotationId = h), l && l.length && (u.oResponse.strBaseAnnotationGuid = l), t ? Cd(!0, u.oResponse) : 
    Dd(!0, u.oResponse)) : u ? u.uErrorNo && 1 == u.uErrorNo && N(!0) : t ? Cd(!1, {bSaveAsNew:m, saveSourceTabId:d}) : Dd(!1, {bSaveAsNew:m, saveSourceTabId:d, saveSourceTabFrameId:f, saveSourceTabWindowId:g, bAnnotatePDFViewer:n, uSaveAnnotationType:y, strOwnerGuid:x});
  });
}
function Dd(a, b) {
  A(["loginResponse", "mapLastLoadAnnotationReqForTab"], c => {
    var e = c.loginResponse;
    c = c.mapLastLoadAnnotationReqForTab;
    var d = {type:b.bTempAnnot && b.bTempAnnot ? "annotateTempSaveRequestStatus" : "annotateSaveRequestStatus", bSuccessful:a, bSaveAsNew:b.bSaveAsNew, saveSourceTabId:b.saveSourceTabId};
    if (a) {
      d.strAnnotationDocSaved = b.strAnnotationDocSaved;
      d.savedAnnotationId = b.uAnnotationId;
      d.savedAnnotationGuid = b.strGUID;
      d.strAssessmentFileGuid = b.strAssessmentFileGuid;
      d.savedAnnotationPath = b.strAnnotationPath;
      d.savedAnnotationVersionNo = b.uVersionNo;
      d.uSaveAnnotationType = b.uSaveAnnotationType;
      d.strOwnerGuid = b.strOwnerGuid;
      d.strStudentGuid = b.strStudentGuid;
      d.bSyncAnnotationForMediaUpdate = b.bSyncAnnotationForMediaUpdate ? b.bSyncAnnotationForMediaUpdate : !1;
      b.uBaseAnnotationId && (d.uBaseAnnotationId = b.uBaseAnnotationId);
      b.strBaseAnnotationGuid && (d.strBaseAnnotationGuid = b.strBaseAnnotationGuid);
      null != b.arrMediaReencodeStatus && 0 < b.arrMediaReencodeStatus.length && (d.arrMediaReencodeStatus = b.arrMediaReencodeStatus);
      var f = b.uAnnotationId, g = b.strGUID;
      b.oAnnotation && "uAnnotationType" in b.oAnnotation ? d.uAnnotationType = b.oAnnotation.uAnnotationType : "uAnnotationType" in b && (d.uAnnotationType = b.uAnnotationType);
      "bCloseTabAfterSave" in b && (d.bCloseTabAfterSave = b.bCloseTabAfterSave);
      var h = null;
      e.bGuidSupported ? e.arrWebAnnotations && (h = e.arrWebAnnotations.find(l => l.strGUID == g)) : e.arrWebAnnotations && (h = e.arrWebAnnotations.find(l => l.uAnnotationId == f));
      if (h) {
        h.uVersionNo = b.uVersionNo, h.strThumbnailPath = b.strThumbnailPath;
      } else {
        if (h = b.oAnnotation) {
          d.strAnnotationName = h.strAnnotationName, e.arrWebAnnotations.push(b.oAnnotation), h.strFilePath && (d.strFilePath = h.strFilePath);
        }
        e.uAllowedSaveCount = b.uAllowedSaveCount;
        if (b.bSaveAsNew && e && 2 == e.uUserType && !b.bAnnotatePDFViewer) {
          let l = b.saveSourceTabId, m = b.saveSourceTabFrameId, v = b.saveSourceTabWindowId;
          0 == m && (console.log("On save as new: Set tab annotation to load on refresh", l), c[l] = {tabId:l, frameId:m, windowId:v, openSavedAnnotationMessage:{bOpenInNewTab:!1, bChangeUrlInCurrentTab:!1, strPageUrl:h.strPageUrl, strGUID:h.strGUID, bUpdateDate:!0, bApplyForcefully:!0}});
        }
      }
      d.arrWebAnnotations = e.arrWebAnnotations;
    }
    w({loginResponse:e, mapLastLoadAnnotationReqForTab:c}).then(() => {
      P(d);
      I(!1);
    });
  });
}
function Cd(a, b) {
  A(["loginResponse"], c => {
    c = c.loginResponse;
    var e = {type:"annotateTempSaveRequestStatus", bSuccessful:a, bSaveAsNew:b.bSaveAsNew, saveSourceTabId:b.saveSourceTabId};
    if (a && (e.strAnnotationDocSaved = b.strAnnotationDocSaved, e.strAssessmentFileGuid = b.strAssessmentFileGuid, e.savedAnnotationPath = b.strAnnotationPath, e.strGUID = b.strGUID, b.oTempAnnotation)) {
      let d = b.oTempAnnotation;
      d.strFilePath && (e.strFilePath = d.strFilePath);
      d.strPageUrl && (e.strPageUrl = d.strPageUrl);
    }
    w({loginResponse:c}).then(() => {
      P(e);
      I(!1);
    });
  });
}
function Bd(a) {
  let b = {uService:2221, strAnnotationData:JSON.stringify(a.annotationData), strThumbnailData:a.thumbnail.replace("data:image/png;base64,", ""), arrMediaAdded:"arrMediaAdded" in a ? a.arrMediaAdded : [], arrCommentMediaAdded:"arrCommentMediaAdded" in a ? a.arrCommentMediaAdded : [], oImageAdded:"oImageAdded" in a ? a.oImageAdded : null, oVideoAdded:"oVideoAdded" in a ? a.oVideoAdded : null, oAssessmentData:"oAssessmentData" in a ? a.oAssessmentData : null};
  "strGUID" in a ? b.strGuid = a.strGUID : b.uAnnotationId = a.savedAnnotationId;
  "strOwnerGuid" in a ? b.strOwnerGuid = a.strOwnerGuid : b.uOwnerId = a.uOwnerId;
  "bMakeTempLivefeedAnnotationNormalAnnotation" in a && (b.bMakeTempLivefeedAnnotationNormalAnnotation = a.bMakeTempLivefeedAnnotationNormalAnnotation, b.updatedName = a.name, b.updatedDescription = a.description);
  return b;
}
function Ed(a, b, c, e, d, f, g, h, l, m) {
  c && e && A(["loginResponse"], v => {
    v = v.loginResponse;
    var t = {type:"annotateSlidesPreviewLoaded", slidesUrl:c, slideId:e, guid:d};
    let n = 1;
    1 == h && v && 3 == v.uUserType && (n = 2);
    if (null == h || -1 == h) {
      n = 2, f && (n = 3);
    }
    var y = c.substring(c.indexOf("docs.google.com/presentation/d/") + 31, c.indexOf("/", c.indexOf("docs.google.com/presentation/d/") + 31));
    console.log("LoadAnnotationDetails:GetAuthTokenFromWindow: uDocType", n, "presentationId", y, "slideId", e);
    va(a, x => {
      x.accessToken || "" != x.accessToken ? gd(y, x.accessToken, function(B, z) {
        B || z.error ? ua(a, {type:"annotatePresentationReload"}, b) : Fd(function(u) {
          let E = 1;
          u && "devicePixelRatio" in u && (E = u.devicePixelRatio);
          u = a.tab.id;
          t.arrSlides = z.slides;
          var M = z.pageSize;
          let J = {};
          if (M) {
            let C = M.width;
            C && (J.uWidth = C.magnitude * E / 9525);
            (M = M.height) && (J.uHeight = M.magnitude * E / 9525);
          }
          t.pageSize = J;
          1 == n || 2 == n ? (bb.push({tabId:u, msg:t, frameId:a.frameId}), K(d, u, a, b, !1, !0, !0, n, !1, g, "", !1, !1, !1, h, l, m, !1)) : 3 == n && hd(y, e, x.accessToken, function(C, O) {
            C || O.error || (t.contentUrl = O.contentUrl);
            t.type = "annotateFeedbackSlidesPreviewLoaded";
            G(a.tab.id, t, {frameId:a.frameId});
          });
        });
      }) : ua(a, {type:"annotatePresentationReload"}, b);
    });
  });
}
function Fd(a) {
  chrome.tabs.query({active:!0, currentWindow:!0}, function(b) {
    let c = 0 < b.length ? b[0].id : -1;
    -1 != c ? S(b[0].url) ? chrome.tabs.sendMessage(c, {type:"getActiveWindowTabProps"}, null, e => {
      chrome.runtime.lastError ? (console.log(chrome.runtime.lastError), a(null)) : a(e);
    }) : a(null) : a(null);
  });
}
function Gd(a) {
  for (var b = 0; b < bb.length; b++) {
    if (bb[b].tabId == a) {
      let c = bb[b];
      G(a, c.msg, {frameId:c.frameId});
      bb.splice(b, 1);
      break;
    }
  }
}
function tc(a, b, c) {
  let e = a.presentationId, d = a.slideId;
  return e && d ? (va(b, f => {
    f.accessToken || "" != f.accessToken ? hd(e, d, f.accessToken, function(g, h) {
      g || h.error ? (ua(b, {type:"ANNOTATE_RELOAD_SLIDE_THUMBNAIL"}, c), c && c({type:"ANNOTATE_REQ_SLIDE_THUMBNAIL_DATA_ERROR", errorType:3})) : b && c({type:"ANNOTATE_RES_SLIDE_THUMBNAIL_DATA", presentationId:e, pageIndex:d, bGoogleSlides:!0, contentUrl:h.contentUrl});
    }) : ua(b, {type:"ANNOTATE_RELOAD_SLIDE_THUMBNAIL"}, c);
  }), !0) : !1;
}
function lb(a) {
  if (a && 0 < a.indexOf("?") && (a = a.substr(a.indexOf("?") + 1)) && a.length) {
    a = new URLSearchParams(a);
    var b = a.get("pdfData");
    if (b) {
      try {
        var c = JSON.parse(atob(b)), e = c.uLivefeedType;
        let d = c.guid;
        console.log(c);
        if (d && (0 == e || 1 == e)) {
          return b = -1, 1 == e && c.uClassId && (b = c.uClassId), b + "_" + d;
        }
      } catch (d) {
      }
    }
    c = a.get("uLivefeedType");
    e = a.get("pId");
    a = a.get("cId");
    try {
      let d = parseInt(c);
      if (e && a && (0 == d || 1 == d)) {
        return a + "_" + e;
      }
    } catch (d) {
    }
  }
  return null;
}
function Vb(a) {
  chrome.tabs.query({active:!0, currentWindow:!0}, function(b) {
    b.length ? S(b[0].url) ? (b = b[0].id, null != b && -1 != b && (a.server_url = "https://annotate.net", console.log("Show Livefeed Notification On ActiveTab", b), (b = chrome.tabs.sendMessage(b, a, null)) && b.then(() => {
    }).catch(c => {
      console.log("Show Livefeed Notification On ActiveTab - ERROR:", c);
    }))) : console.log("Show Livefeed Notification On ActiveTab - IGNORED: active tab don't allow script injection") : console.log("Show Livefeed Notification On ActiveTab - IGNORED: no tabs found");
  });
}
function Rb(a, b, c) {
  A(["mapLivefeedTab"], e => {
    e = e.mapLivefeedTab;
    e[a] && e[a].tabId ? (e = e[a].tabId, console.log("Launch livefeed on existing tab", a, e), Jb(e, !1, -1), Hd(a, b, e)) : null != c && -1 != c ? (console.log("Launch livefeed on prefered tab", a, c), a && bd(a, -1, c), Hd(a, b, c)) : Id(a, b);
  });
}
function Yb(a, b, c) {
  return {type:"launchLivefeedOnJoin", LivefeedInfo:b, livefeedId:a, bLaunchingOnSelfLivefeedTab:c, server_url:"https://annotate.net"};
}
function Hd(a, b, c) {
  console.log("Livefeed Launch Via Existing Livefeed Tab", a, c);
  (c = chrome.tabs.sendMessage(c, Yb(a, b, !0), null)) && c.then(() => {
  }).catch(e => {
    console.log("Livefeed Launch Via Existing Livefeed Tab - ERROR:", e);
    Id(a, b);
  });
}
function Id(a, b) {
  chrome.tabs.query({active:!0, currentWindow:!0}, function(c) {
    if (c.length) {
      if (S(c[0].url)) {
        if (c = c[0].id, null != c && -1 != c) {
          let e = Yb(a, b, !1);
          console.log("Livefeed Launch Via ActiveTab", c);
          U(!0, e);
          (c = chrome.tabs.sendMessage(c, e, null)) && c.then(() => {
          }).catch(d => {
            console.log("Livefeed Launch Via ActiveTab - ERROR:", d);
            U(!1);
          });
        }
      } else {
        console.log("Livefeed Launch Via ActiveTab - IGNORED: active tab don't allow script injection");
      }
    } else {
      console.log("Livefeed Launch Via ActiveTab - IGNORED: no tabs found");
    }
  });
}
function Ub(a, b, c, e = !1) {
  b && A(["mapLivefeedTab"], d => {
    d = d.mapLivefeedTab;
    d[b] && d[b].tabId ? (d = d[b].tabId, console.log("Launch livefeed on existing tab", b, d), Jb(d, !1, -1), R(a, d), Jd(a, d)) : e || Kd(a, c);
  });
}
function Jd(a, b) {
  console.log("CCL Livefeed Launch Via Existing Livefeed Tab", b);
  a = Object.assign({}, a);
  a.bLaunchingOnSelfLivefeedTab = !0;
  a.server_url = "https://annotate.net";
  (b = chrome.tabs.sendMessage(b, a, null)) && b.then(() => {
  }).catch(c => {
    console.log("CCL Livefeed Launch Via Existing Livefeed Tab - ERROR:", c);
  });
}
var Ld = !1;
function Kd(a, b = !1) {
  A(["uTabIdLivefeedLaunchForCCL"], c => {
    c = c.uTabIdLivefeedLaunchForCCL;
    -1 == c ? Ld ? console.log("CCL Livefeed Launch Via ActiveTab - IGNORED: pending prev") : (Bb(!0), Ld = !0, setTimeout(() => {
      Ld = !1;
      chrome.tabs.query({active:!0, currentWindow:!0}, function(e) {
        e.length ? S(e[0].url) ? (e = e[0].id, null != e && -1 != e && (a.server_url = "https://annotate.net", console.log("CCL Livefeed Launch Via ActiveTab", e), U(!0, a), (e = chrome.tabs.sendMessage(e, a, null)) && e.then(() => {
        }).catch(d => {
          console.log("CCL Livefeed Launch Via ActiveTab - ERROR:", d);
          U(!1);
          Md(a);
        }))) : (console.log("CCL Livefeed Launch Via ActiveTab - IGNORED: active tab don't allow script injection"), Md(a)) : console.log("CCL Livefeed Launch Via ActiveTab - IGNORED: no tabs found");
      });
    }, b ? 1 : 2000)) : console.log("Send Livefeed Notification On ActiveTab - IGNORED: because uTabIdLivefeedLaunchForCCL", c);
  });
}
function Md(a) {
  A(["uEventServerConnectedTabId"], b => {
    b = b.uEventServerConnectedTabId;
    console.log("CCL Livefeed Launch Via EventConnectedTab", b);
    null != b && -1 != b && (a.server_url = "https://annotate.net", b = chrome.tabs.sendMessage(b, a, null)) && (U(!0, a), b.then(() => {
    }).catch(c => {
      U(!1);
      console.log("CCL Livefeed Launch Via EventConnectedTab - ERROR:", c);
    }));
  });
}
function R(a, b) {
  a = {message:a, tabId:b};
  console.log("LastCCLLivefeedTabData", a);
  w({LastCCLLivefeedTabData:a});
  Bb();
}
function Xb(a) {
  a = {message:a, tabId:-1};
  console.log("LastORLivefeedTabData", a);
  w({LastORLivefeedTabData:a}).then(() => {
    Cb();
  });
}
var Nd = null, T = null;
function U(a, b = null) {
  console.log("bMarkNewTabLivefeedLaunchOnTabCreate", a);
  T = b;
  a ? (Nd && (clearTimeout(Nd), Nd = null), Nd = setTimeout(() => {
    Nd = null;
    console.log("timeout wait for new tab creation -- reset bMarkNewTabLivefeedLaunchOnTabCreate");
    U(!1);
  }, 5000)) : Nd && (clearTimeout(Nd), Nd = null);
  w({bMarkNewTabLivefeedLaunchOnTabCreate:a});
}
function cd(a) {
  w({uTabIdLivefeedLaunchForCCL:a});
}
function pb() {
  A(["bWebConnected"], a => {
    a = a.bWebConnected;
    null != a && (console.log("sent to ccl homepage - web conn state", a), Od({type:"extCCLLivefeedState", bForWebConnState:!0, bWebConnectedOnExt:a}));
  });
}
function Bb(a = !1) {
  A(["LastCCLLivefeedTabData"], b => {
    b = b.LastCCLLivefeedTabData;
    let c = !1;
    !b.message || b.tabId && -1 != b.tabId || (c = a);
    console.log("sent to ccl homepage - Active Livefeed/ launching state", b, c);
    Od({type:"extCCLLivefeedState", bAvailable:b.message ? !0 : !1, tabId:b.tabId ? b.tabId : -1, bLaunching:c});
  });
}
function Od(a) {
  chrome.tabs.query({}, function(b) {
    for (var c = 0; c < b.length; c++) {
      if (ob(b[c].url)) {
        var e = chrome.tabs.sendMessage(b[c].id, a, null);
        e && e.then(() => {
        }).catch(d => console.log(d));
      }
    }
  });
}
function Vc(a) {
  chrome.tabs.query({}, function(b) {
    for (var c = 0; c < b.length; c++) {
      if (nd(b[c].url)) {
        var e = chrome.tabs.sendMessage(b[c].id, a, null);
        e && e.then(() => {
        }).catch(d => console.log(d));
      }
    }
  });
}
var Dc = !1, Pd = !1, Qd = !1;
function zd(a) {
  Pd ? (console.log("CCL Active Livefeed: livefeed launch is in cooldown period"), Qd = !0) : (Pd = !0, setTimeout(() => {
    Pd = !1;
    Qd && (console.log("CCL Active Livefeed: on cooldown end... check active livefeed on server"), Qd = !1, null != Q && (clearTimeout(Q), Q = null), Sb());
  }, 15E3), P({type:"annotateCheckActiveLivefeedCCL"}), setTimeout(() => {
    let b = {ActiveLivefeedForCCL:a, type:"annotateLivefeedNotificationEvent"};
    A(["LastCCLLivefeedTabData"], c => {
      R(b, c.LastCCLLivefeedTabData.tabId);
    });
    Dc ? (console.log("CCL Active Livefeed: aborted new launch"), Dc = !1) : (console.log("CCL Active Livefeed: launch in new tab"), console.log("LIVEFEED LAUNCH CCL(auto):", a.livefeedId), Ub(b, a.livefeedId, !1, !0));
  }, 3E3));
}
function tb(a, b, c) {
  console.log(">>OpenSavedAnnotations");
  A(["bAnnotationMode", "loginResponse"], e => {
    e.bAnnotationMode && (e.bAnnotationMode = !1, w(e).then(() => {
      I(!1);
      Ea();
    }));
    var d = decodeURIComponent(a.strPageUrl), f = a.strGUID, g = !1;
    a.bForScreenShot && (g = !0);
    let h = -1;
    a.uClassId && (h = a.uClassId);
    var l = !1;
    a.bShared && (l = !0);
    let m = -1;
    "uLivefeedType" in a && (m = a.uLivefeedType);
    let v = -1;
    "uLivefeedActivityId" in a && (v = a.uLivefeedActivityId);
    let t = {};
    if ("extraData" in a) {
      try {
        t = JSON.parse(a.extraData);
      } catch (B) {
        console.log("err while parse extra data ", B);
      }
    }
    t.bTakeFullControl = "bTakeFullControl" in a ? a.bTakeFullControl : 0;
    e = e.loginResponse;
    let n = 1;
    if (a.bPublished || "bAllowTakeNotes" in a && a.bAllowTakeNotes || e && 3 == e.uUserType && (1 == m || k(h) && -1 != h)) {
      n = 2;
    }
    if (-1 == d.indexOf("http://") && -1 == d.indexOf("https://") && -1 == d.indexOf("file://") || "pdf" != d.split(/#|\?/)[0].split(".").pop().trim().toLowerCase()) {
      try {
        JSON.parse(d);
        e = null;
        a.bChangeUrlInCurrentTab && (e = b.tab);
        var y = !1;
        a.bCoTeacherPublishedFile && (y = a.bCoTeacherPublishedFile);
        Ia(d, f, n, l, !0, e, h, y, m, v, t, c);
        return;
      } catch (B) {
      }
      var x = !1;
      if ("strCloneAnnotationMapGUID" in a && -1 != a.strCloneAnnotationMapGUID || "bWebPageClassroomAssignment" in a) {
        console.log(">> webpage flag received from pdf"), console.log(a), x = !0, t.strCloneAnnotationMapGUID = a.strCloneAnnotationMapGUID, t.strStudentGuid = a.strStudentGuid, t.bNonAnnotateStudent = a.bNonAnnotateStudent;
      }
      a.bOpenInNewTab ? chrome.tabs.create({active:!0, url:d}, function(B) {
        var z = B.id;
        let u = !1;
        a.bCoTeacherPublishedFile && (u = a.bCoTeacherPublishedFile);
        L.push({tabId:z, frameId:0, loadCallback:() => {
          K(f, z, b, c, g, !0, !1, n, !1, h, d, l, a.bUpdateDate, u, m, v, t, x);
        }});
      }) : a.bChangeUrlInCurrentTab ? chrome.tabs.update(b.tab.id, {url:d}, function(B) {
        var z = B.id;
        L.push({tabId:z, frameId:b.frameId, loadCallback:() => {
          K(f, z, b, c, g, !0, !1, n, !1, h, d, l, a.bUpdateDate, !1, m, v, t, x);
        }});
      }) : K(f, b.tab.id, b, c, g, "bApplyForcefully" in a ? a.bApplyForcefully : !1, !1, n, !1, h, d, l, a.bUpdateDate, !1, m, v, t, x);
    } else {
      e = null, a.bChangeUrlInCurrentTab && (e = b.tab), y = !1, a.bCoTeacherPublishedFile && (y = a.bCoTeacherPublishedFile), Ia(d, f, n, l, !1, e, h, y, m, v, t, c);
    }
  });
}
function bc(a, b) {
  A(["loginResponse"], c => {
    if (c = c.loginResponse) {
      let e = c.bGuidSupported, d = decodeURIComponent(a.strPageUrl);
      c = a.uUserType;
      let f = -1, g = -1, h = null, l = null, m = 3 == c ? 2 : 3, v = {};
      e ? (h = a.strStudentAnnotationGuid, l = a.strInstructorWebAnnotationGuid, v = {uService:2341, strStudentAnnotationGuid:h, strInstructorWebAnnotationGuid:l,}) : (f = a.uStudentAnnotationId, g = a.uInstructorWebAnnotationId, v = {uService:2341, uStudentAnnotationId:f, uInstructorWebAnnotationId:g,});
      if (2 == c) {
        c = p(v);
      } else if (3 == c) {
        c = q(v);
      } else {
        return;
      }
      r(c, "POST", "/zpaduserrequest.php", function(t, n) {
        if (n) {
          if (!e && -1 != g && -1 == f || e && l && !h) {
            t.oResponse.oAnnotationFile.uVersionNo = -1, t.oResponse.oAnnotationFile.strAnnotationDoc = "{}", t.oResponse.oAnnotationFile.strFilePath = "";
          }
          t.oResponse.strAnnotationDoc = "{}";
          t.oResponse.uVersionNo = -1;
          t.oResponse.uDocType = m;
          n = !1;
          a.bWebPageClassroomAssignment && (n = !0);
          Ta(t.oResponse, b.tab.id, b, !1, !1, !1, m, !1, -1, d, !1, !1, -1, -1, null, n);
        }
      });
    }
  });
}
function K(a, b, c, e, d, f, g, h, l, m, v, t, n, y, x, B, z, u) {
  console.log("LoadSavedAnnotations", u);
  u && (Qa = performance.now());
  A(["loginResponse", "mapLastLoadAnnotationReqForTab"], E => {
    var M = E.loginResponse;
    E = E.mapLastLoadAnnotationReqForTab;
    y = y && 1 == h;
    if (!(0 != c.frameId || g || d || x && -1 != x) && M) {
      console.log("On Apply Saved Webannotation: Set tab annotation to load on refresh", b);
      var J = {tabId:b, frameId:c.frameId, windowId:c.tab.windowId};
      J.loadCallbackArgs = l ? {extraData:z} : {guid:a, tabId:b, sender:null, sendResponse:null, bForScreenShot:!1, bApplyForceFully:!0, bSlidesPreview:!1, uDocType:h, bPDFViewer:!1, uClassId:m, strBaseUrl:v, bShared:t, bUpdateDate:n, bCoTeacherPublishedFile:y, uLivefeedType:x, uLivefeedActivityId:B, bWebPageClassroomAssignment:u, extraData:z};
      E[b] = J;
      w({mapLastLoadAnnotationReqForTab:E});
    }
    if (2 == h) {
      J = null;
      z && z.SharedNotesFeedbackData && (J = z.SharedNotesFeedbackData.strSharedStudentGUID);
      var C = !1;
      if (-1 != x || null != J) {
        C = !0;
      }
      E = "/zpadstudentrequest.php";
      let O = {uService:2273, strGUID:a, bLoadBaseDoc:C ? 1 : 0, strSharedStudentGUID:J,};
      C = q(O);
      if (M.ChromeClientLogin || 2 == M.uUserType && J) {
        E = "/zpadopenrequest.php", C = p(O);
      }
    } else {
      E = "/zpadopenrequest.php", C = p({uService:2197, strGUID:a, bTakeFullControl:z && "bTakeFullControl" in z ? z.bTakeFullControl : 0});
    }
    r(C, "POST", E, function(O, W) {
      W ? (Ta(O.oResponse, b, c, d, f, g, h, l, m, v, t, n, x, B, z, u), u && !z.bNonAnnotateStudent && Ra(c, {strCloneAnnotationMapGUID:z.strCloneAnnotationMapGUID, strUserGuid:M.strUserGuid, uUserType:M.uUserType, strBaseUrl:v, strStudentGuid:z.strStudentGuid}, b), e && e({success:!0})) : e && e({success:!1});
    });
  });
}
function Rd(a, b) {
  a = p(Sd(a, b));
  r(a, "POST", "/zpaduserrequest.php", function(c, e) {
    console.log("sendUpdateLastOpenedTime", e);
  });
}
function Wb(a) {
  return a && 4 == a.uUserType ? !0 : !1;
}
function Ta(a, b, c, e, d, f, g, h, l, m, v, t, n, y, x, B) {
  A(["loginResponse"], z => {
    var u = z.loginResponse;
    try {
      z = -1;
      var E = null, M = a.strAnnotationPath, J = a.bGoogleAssignmentAutosaved ? a.bGoogleAssignmentAutosaved : !1;
      let O = "strLockOwnerGuid" in a ? a.strLockOwnerGuid : "", W = 1;
      a.bCoTeacher || u && u.ChromeClientLogin ? W = 2 : u && 3 == u.uUserType ? W = 3 : Wb(u) && (W = 4);
      null == u && (W = 5);
      let Ba = u ? u.strUserGuid : null;
      k(Ba) && ("" == O && 1 == W || Ba == a.strUserGuid || -1 != l || Ba == O && -1 != l) ? (z = a.uAnnotationId, E = a.strGUID, t && Rd(z, 1 == u.bGuidSupported ? a.strGUID : null)) : Wb(u) && (z = a.uAnnotationId, E = a.strGUID);
      if ((u = 2 == g && !J) || -1 != n) {
        z = a.uAnnotationId, E = a.strGUID;
      }
      let Kb = null;
      if (a.uAnnotationId && -1 != a.uAnnotationId || k(a.strGUID)) {
        Kb = {uPublisherId:a.uUserId, strPublisherGuid:a.strUserGuid, strS3BucketFullPath:a.strS3BucketFullPath, strAnnotateDataRequestUrl:a.strAnnotateDataRequestUrl, uPublishedAnnotationId:a.uAnnotationId, strPublishedAnnotationGuid:a.strGUID ? a.strGUID : null, strPublishedAnnotationPath:a.strAnnotationPath, strPublisherPicture:a.strUserPicture, oPublisherPicturePosition:a.oUserPicturePosition, strPublisherFirstName:a.strFirstName, strPublisherLastName:a.strLastName, uPublisherFeatureValue:"uPublisherFeatureValue" in 
        a ? a.uPublisherFeatureValue : 0, bSharedDoc:v, strLockOwnerGuid:O,};
      }
      var C = {type:"annotateSavedAnnotations", annotationId:z, oAssessmentFileInfo:"oAssessmentFileInfo" in a ? a.oAssessmentFileInfo : null, strAnnotationPath:M, strAnnotationName:a.strAnnotationName, strPageUrl:a.strPageUrl, versionNo:a.uVersionNo, bForScreenShot:e, bApplyForceFully:d, bSlidesPreview:f, bPDFViewer:h, annotationData:JSON.parse(a.strAnnotationDoc), arrMediaReencodeStatus:a.arrMediaReencodeStatus, strGUID:E, bPublished:u, bShared:v, uClassId:l, strBaseUrl:m, strFilePath:a.strFilePath, 
      strAnnotateDataRequestUrl:a.strAnnotateDataRequestUrl, strS3BucketFullPath:a.strS3BucketFullPath, uLivefeedType:n, uLivefeedActivityId:y, baseDocumentOwnerInfo:Object.assign({}, Kb), uDocAccessedAs:W, extraLoadedData:x, bWebPageClassroomAssignment:B, oLivefeed:a.oLivefeed};
      "bNotesAllowed" in a && (C.bNotesAllowed = "1" == a.bNotesAllowed ? !0 : !1);
      let Ca = {bUpdateArrWebAnnotations:!1};
      if (1 != g || J) {
        a.uStudentId && (C.uStudentId = a.uStudentId);
        let D = a.oAnnotationFile;
        if (D) {
          let Xa = {annotationId:D.uAnnotationId, strGUID:D.strGUID ? D.strGUID : null, strAnnotationPath:D.strAnnotationPath, versionNo:D.uVersionNo, annotationData:JSON.parse(D.strAnnotationDoc), uPublisherId:D.uUserId, strPublisherGuid:D.strUserGuid, strPublisherPicture:D.strUserPicture, oPublisherPicturePosition:D.oUserPicturePosition, strPublisherFirstName:D.strFirstName, strPublisherLastName:D.strLastName, uPublisherFeatureValue:D.uPublisherFeatureValue, arrMediaReencodeStatus:"arrMediaReencodeStatus" in 
          D ? D.arrMediaReencodeStatus : [],};
          C.notesData = Xa;
          "bNewNotesDocCreated" in a && 1 == parseInt(a.bNewNotesDocCreated) && 3 == W && k(D.strUserGuid) && D.strUserGuid == Ba && (Ca.bUpdateArrWebAnnotations = !0, Ca.oAnnotation = {strGUID:D.strGUID, uAnnotationType:1, uVersionNo:D.uVersionNo});
        }
        let H = a.oFeedbackFile;
        if (H) {
          let Xa = {annotationId:H.uAnnotationId, strGUID:H.strGUID ? H.strGUID : null, strAnnotationPath:H.strAnnotationPath, versionNo:H.uVersionNo, annotationData:JSON.parse(H.strAnnotationDoc), uPublisherId:H.uUserId, strPublisherGuid:H.strUserGuid, strPublisherPicture:H.strUserPicture, oPublisherPicturePosition:H.oUserPicturePosition, strPublisherFirstName:H.strFirstName, strPublisherLastName:H.strLastName, uPublisherFeatureValue:H.uPublisherFeatureValue, arrMediaReencodeStatus:"arrMediaReencodeStatus" in 
          H ? H.arrMediaReencodeStatus : [],};
          C.feedbackData = Xa;
        }
      }
      "uDocType" in a && a.uDocType && (g = a.uDocType);
      C.uCurrentMode = g;
      (C.bGoogleAssignmentAutosaved = J) && "courseWorkDetails" in a && (C.courseWorkDetails = a.courseWorkDetails);
      x && x.SharedNotesFeedbackData && x.SharedNotesFeedbackData.strSharedStudentGUID ? Td(c.tab.id, D => {
        D && (C.annotationData = Object.assign(C.annotationData, D));
        Ud(a.strGUID, a.uVersionNo, a.strThumbnailPath, a.strUserGuid, b, b == c.tab.id ? c.frameId : 0, C, Ca);
        Gd(b);
      }) : (Ud(a.strGUID, a.uVersionNo, a.strThumbnailPath, a.strUserGuid, b, b == c.tab.id ? c.frameId : 0, C, Ca), Gd(b));
    } catch (O) {
    }
  });
}
function Td(a, b) {
  (a = chrome.tabs.sendMessage(a, {type:"getBaseDocDataForSharedNotesFeedback"}, {frameId:0})) && a.then(c => {
    c.baseDocData ? b(c.baseDocData) : b(null);
  }).catch(() => {
    b(null);
  });
}
function Ud(a, b, c, e, d, f, g, h) {
  chrome.tabs.get(d, function(l) {
    let m = () => {
      Pc(g, d);
      G(d, g, {frameId:f});
      A(["bAnnotationMode", "loginResponse"], n => {
        let y = !1, x = n.loginResponse;
        if (k(x) && x.arrWebAnnotations) {
          if (h && h.bUpdateArrWebAnnotations) {
            let B = h.oAnnotation;
            k(B) && !x.arrWebAnnotations.find(z => z.strGUID == B.strGUID) && (y = !0, x.arrWebAnnotations.push(B), console.log(`new notes doc ${B.strGUID} info added in arrWebAnnotations`));
          } else if (x.strUserGuid == e) {
            let B = x.arrWebAnnotations.find(z => z.strGUID == a);
            B && (y = !0, B.uVersionNo = b, B.strThumbnailPath = c);
          }
        }
        n.bAnnotationMode && !y || w({loginResponse:x, bAnnotationMode:!0}).then(() => {
          I(!1);
          Ea();
        });
      });
    };
    if (l) {
      var v = l.windowId, t = l.width;
      chrome.tabs.getZoom(d, function(n) {
        chrome.windows.get(v, {}, function(y) {
          g.winWidth = y.width;
          g.tabWidth = t;
          g.tabZoom = n;
          m();
        });
      });
    } else {
      m();
    }
  });
}
function Pc(a, b) {
  a && (a.bGoogleAssignmentAutosaved || a.annotationId && -1 != a.annotationId || k(a.strGUID)) && (b = {type:"annotateClassDocumentOpened", sourceTabId:b, uClassId:a.uClassId, annotationId:a.annotationId, strGUID:a.strGUID, bLivefeedAtSourceTab:"uLivefeedType" in a && -1 != a.uLivefeedType}, a.bGoogleAssignmentAutosaved && (a.strGoogleCourseWorkId && (b.strGoogleCourseWorkId = a.strGoogleCourseWorkId), a.strGoogleSubmissionId && (b.strGoogleSubmissionId = a.strGoogleSubmissionId)), P(b));
}
function Cc(a) {
  if (a) {
    let b = a.sourceTabId;
    a.type = "annotateClassDocumentOpenedFound";
    G(b, a);
  }
}
function Sd(a, b) {
  let c = {uService:2293};
  b ? c.strAnnotationGuid = b : c.uAnnotationId = a;
  return c;
}
function $b(a, b) {
  chrome.windows.update && !chrome.tabs.setZoom || Vd(b);
  chrome.tabs.setZoom(b.tab.id, 1);
  chrome.windows.get(b.tab.windowId, {}, function(c) {
    chrome.tabs.query({windowId:b.tab.windowId, active:!0}, function(e) {
      c.width - e[0].width + a.width == c.width ? Vd(b) : c.width > a.width ? chrome.windows.update && chrome.windows.update(b.tab.windowId, {state:"normal"}, function(d) {
        chrome.tabs.query({windowId:b.tab.windowId, active:!0}, function(f) {
          chrome.windows.update(b.tab.windowId, {width:d.width - f[0].width + a.width});
          Vd(b);
        });
      }) : c.width < a.width ? chrome.windows.update && chrome.windows.update(b.tab.windowId, {state:"maximized"}, function(d) {
        chrome.tabs.query({windowId:b.tab.windowId, active:!0}, function(f) {
          f = f[0];
          var g = d.width - f.width + a.width;
          g == d.width ? Vd(a) : g > d.width ? (chrome.tabs.setZoom(f.id, d.width / g), Vd(a)) : (chrome.windows.update(b.tab.windowId, {state:"normal", width:g}), Vd());
        });
      }) : Vd(b);
    });
  });
}
function Vd(a) {
  chrome.tabs.get(a.tab.id, function(b) {
    var c = b.windowId, e = b.width;
    chrome.tabs.getZoom(a.tab.id, function(d) {
      chrome.windows.get(c, {}, function(f) {
        (f = chrome.tabs.sendMessage(a.tab.id, {type:"annotateNewWindowDimensions", winWidth:f.width, tabWidth:e, tabZoom:d}, null)) && f.then(() => {
        }).catch(g => console.log(g));
      });
    });
  });
}
function hc(a, b) {
  a = {uService:2263, strCustomPropData:JSON.stringify(a.dictCustomPropData)};
  a = p(a);
  r(a, "POST", "/zpaduserrequest.php", function(c, e, d) {
    e ? Wd(d, b) : c ? c.uErrorNo && 1 == c.uErrorNo && N(!0) : Wd(d, b);
  });
}
function Wd(a, b) {
  A(["loginResponse"], c => {
    (c = c.loginResponse) && (c.strExtensionCustomProperties = a.oRequest.strCustomPropData);
    w({loginResponse:c}).then(() => {
      var e = {type:"annotateCustomPropertiesUpdated", strExtensionCustomProperties:a.oRequest.strCustomPropData};
      chrome.tabs.query({}, function(d) {
        for (var f = 0; f < d.length; f++) {
          S(d[f].url) && (e.tabId = b.tab.id, e.frameId = b.frameId, G(d[f].id, e));
        }
      });
    });
  });
}
function ic(a, b) {
  if (b && b.tab && b.tab.id) {
    let c = {type:"annotateSlidePreviewKeyEvent", evtData:a.evtData};
    a.isParentIFrame ? kc(b.tab.id, c) : G(b.tab.id, c);
  }
}
function jc(a, b) {
  if (b && b.tab && b.tab.id) {
    let c = {index:a.pageInx, type:"annotateNavigatePreviewSlideJump"};
    a.isParentIFrame ? kc(b.tab.id, c) : G(b.tab.id, c);
  }
}
function mc(a, b, c) {
  b && G(b.tab.id, {type:"annotatePresentationDataReceived"}, {frameId:b.frameId});
  var e = a.pid, d = a.sid;
  let f = !1;
  "bFeedback" in a && 1 == a.bFeedback && (f = !0);
  let g = -1;
  "cId" in a && (g = a.cId);
  let h = null;
  if ("eData" in a) {
    try {
      h = JSON.parse(atob(a.eData));
    } catch (v) {
      h = null, console.log("LoadGoogleSlidesPresentation ", v);
    }
  }
  let l = -1, m = -1;
  "uLivefeedType" in a && (l = a.uLivefeedType, "uLivefeedActivityId" in a && (m = a.uLivefeedActivityId));
  Xd(e, b, c, d, f, g, l, m, h);
}
function Yd(a, b, c) {
  return {uService:2271, strGUID:a, uUserType:b, uClassId:c};
}
function Xd(a, b, c, e, d, f, g, h, l) {
  var m, v;
  A(["loginResponse"], t => {
    var n = t.loginResponse;
    null == g || 0 != g || n.ChromeClientLogin ? (t = d ? 2 : 3, n && n.uUserType && (t = n.uUserType), n = Yd(a, t, f), m = 2 == t ? p(n) : q(n), v = "/zpaduserrequest.php") : (m = q(Yd(a, 4, -1)), v = "/opengroupstudentrequest.php");
    r(m, "POST", v, function(y, x) {
      console.log("LoadAnnotationDetails:Response:", x);
      if (x) {
        if (y = y.oResponse.strPageUrl) {
          x = y.lastIndexOf("/edit"), -1 != x && (y = y.substring(0, x), y += "/preview?rm=minimal"), console.log("LoadAnnotationDetails:SetSlidesPreviewData:", y, e, "bFeedback", d, "ClassId LivefeedType", f, g), Ed(b, c, y, e, a, d, f, g, h, l);
        }
      } else {
        y ? (x = 1, void 0 != y.uErrorNo && (1 == y.uErrorNo ? x = 4 : 10 == y.uErrorNo && (x = 5)), Zd(c, x)) : Zd(c, 1);
      }
    });
  });
}
function Zd(a, b) {
  a && a({type:"annotatePresentationLoadError", errorType:b});
}
function La(a, b) {
  b && A(["mapLastLoadAnnotationReqForTab"], c => {
    c = c.mapLastLoadAnnotationReqForTab;
    let e = c[a];
    if (e) {
      let d = e.loadCallbackArgs.extraData;
      d || (d = {});
      for (const f of Object.keys(b)) {
        d[f] = b[f];
      }
      e.loadCallbackArgs.extraData = d;
      c[a] = e;
      w({mapLastLoadAnnotationReqForTab:c});
      console.log(">> data added");
      console.log(c[a]);
    }
  });
}
function pc(a, b) {
  a && b && b.tab && b.tab.id && chrome.tabs.query({}, function(c) {
    for (var e = 0; e < c.length; e++) {
      if (c[e].url.trim() == a.trim()) {
        Jb(c[e].id, !0, b.tab.id);
        return;
      }
    }
    chrome.tabs.update(b.tab.id, {url:a});
  });
}
function oc(a) {
  a && a.tab && a.tab.id && chrome.tabs.remove(a.tab.id, function() {
  });
}
function mb(a) {
  A(["mapLivefeedTab", "LastCCLLivefeedTabData"], b => {
    let c = b.mapLivefeedTab, e = Object.keys(c);
    for (let d = 0; d < e.length; d++) {
      if (c[e[d]].tabId == a) {
        Uc({data:{uLivefeedId:c[e[d]].uLivefeedActivityId, arrEvents:[{uEvent:10}]}}, null);
        delete c[e[d]];
        console.log("mapLivefeedTab - on tab remove/navigatedAway", c, "removed", e[d], a);
        w({mapLivefeedTab:c});
        break;
      }
    }
    (b = b.LastCCLLivefeedTabData) && a == b.tabId && R(b.message, -1);
  });
}
function nb(a) {
  A(["loginResponse", "livefeedStartedTabInfo"], b => {
    var c = b.loginResponse;
    b = b.livefeedStartedTabInfo;
    null != c && 2 == c.uUserType && b && (b.tabId == a && (console.log("--\x3e End livefeed on tab remove/refresh/navigatedAway for tab", a), b.bOpenLivefeed ? (c = b.strOpenRoomId) && na(c) : ma(b.uRoomId, b.strUserGuid), b = null), console.log("livefeed started tab list data updated ", b), w({livefeedStartedTabInfo:b}));
  });
}
function S(a) {
  return a && a.length && 0 != a.indexOf("chrome://") && 0 != a.indexOf("https://chrome.google.com/") && 0 != a.indexOf("about:") && 0 != a.indexOf("edge://") ? !0 : !1;
}
chrome.tabs.onActivated.addListener(function(a) {
  $d(a);
  ub();
  ae();
});
function $d(a) {
  chrome.tabs.query({}, function(b) {
    for (var c = 0; c < b.length; c++) {
      if (S(b[c].url)) {
        var e = chrome.tabs.sendMessage(b[c].id, {type:"ActiveTabChanged", tabId:a.tabId, windowId:a.windowId}, null);
        e && e.then(() => {
        }).catch(d => console.log(d));
      }
    }
  });
}
function ae() {
  chrome.tabs.query({currentWindow:!0, active:!0}, function(a) {
    if (a.length) {
      let b = a[0];
      S(b.url) && "complete" == b.status && setTimeout(() => {
        var c = chrome.tabs.sendMessage(b.id, {type:"is_annotate_content_script_installed"}, {frameId:0});
        c && c.then(() => {
        }).catch(() => {
          console.log("Inject script on tab activate", b.id);
          var e = chrome.runtime.getManifest().content_scripts[0].js, d = chrome.runtime.getManifest().content_scripts[0].css;
          chrome.scripting.insertCSS({target:{tabId:b.id, allFrames:!0}, files:d});
          chrome.scripting.executeScript({target:{tabId:b.id, allFrames:!0}, files:e});
        });
      }, 5000);
    }
  });
}
function Oc(a) {
  let b = a.tab.id;
  chrome.runtime.getManifest();
  chrome.runtime.getManifest();
  chrome.webNavigation.getAllFrames({tabId:b}).then(c => {
    if (1 < c.length) {
      let e = c[c.length - 1].frameId;
      setTimeout(() => {
        var d = chrome.tabs.sendMessage(b, {type:"is_annotate_content_script_installed"}, {frameId:e});
        d && d.then(f => {
          console.log("installation check", f);
        }).catch(() => {
          console.log("Inject script in frame", b, e);
          var f = chrome.runtime.getManifest().content_scripts[0].js, g = chrome.runtime.getManifest().content_scripts[0].css;
          chrome.scripting.insertCSS({target:{tabId:b, allFrames:!1, frameIds:[e]}, files:g});
          chrome.scripting.executeScript({target:{tabId:b, allFrames:!1, frameIds:[e]}, files:f});
        });
      }, 1000);
    }
  });
}
function Uc(a, b) {
  a = p({uService:2251, uLivefeedId:a.data.uLivefeedId, arrEvents:a.data.arrEvents});
  r(a, "POST", "/zpaduserrequest.php", function(c, e) {
    e && c && c.oResponse && c.oResponse.bSuccessful ? b && b({bSuccess:!0}) : b && b({bSuccess:!1});
  });
}
chrome.tabs.onRemoved.addListener(function(a) {
  console.log("tab removed", a);
  Ha.g.delete(a);
  nb(a);
  mb(a);
  V(a, !1);
  kb(a);
  Wc(a);
  A(["mapLastLoadAnnotationReqForTab", "uTabIdLivefeedLaunchForCCL", "LastCCLLivefeedTabData"], b => {
    var c = b.mapLastLoadAnnotationReqForTab;
    let e = b.uTabIdLivefeedLaunchForCCL;
    b = b.LastCCLLivefeedTabData;
    c[a] && (console.log("Deleted mapLastLoadAnnotationReqForTab For Tab (remove tab)", a), delete c[a]);
    w({mapLastLoadAnnotationReqForTab:c});
    a == e && (console.log("onRemoved - uTabIdLivefeedLaunchForCCL", a, "--\x3e", -1), cd(-1));
    b && a == b.tabId && R(b.message, -1);
  });
});
chrome.windows.onRemoved.addListener(function(a) {
  Xc(a);
  A(["mapLastLoadAnnotationReqForTab"], b => {
    b = b.mapLastLoadAnnotationReqForTab;
    for (let c in b) {
      b[c].windowId == a && (console.log("Deleted mapLastLoadAnnotationReqForTab For Tab (remove window)", c), delete b[c]);
    }
    w({mapLastLoadAnnotationReqForTab:b});
  });
});
function cb() {
  var a = chrome.runtime.getManifest().content_scripts[0].js, b = chrome.runtime.getManifest().content_scripts[0].css;
  console.log("contentjs", a);
  chrome.tabs.query({}, function(c) {
    for (var e = 0; e < c.length; e++) {
      var d = c[e];
      S(d.url) && (chrome.scripting.executeScript({target:{tabId:d.id, allFrames:!0}, files:a}), chrome.scripting.insertCSS({target:{tabId:d.id, allFrames:!0}, files:b}), console.log("Inject script in tab", d.id));
    }
  });
}
chrome.windows.onFocusChanged.addListener(() => {
  ae();
});
chrome.runtime.onStartup.addListener(() => {
  console.log("Chrome started... check login");
  A(["uTabIdLivefeedLaunchForCCL", "mapLastLoadAnnotationReqForTab", "mapLivefeedTab", "mapExportInProgressTab"], a => {
    console.log("onStartup... clearing mapLastLoadAnnotationReqForTab", a.mapLastLoadAnnotationReqForTab, "mapLivefeedTab", a.mapLivefeedTab, "mapExportInProgressTab", a.mapExportInProgressTab);
    console.log("onStartup - uTabIdLivefeedLaunchForCCL", a.uTabIdLivefeedLaunchForCCL, "--\x3e", -1);
    cd(-1);
    U(!1);
    R(null, -1);
    w({mapLivefeedTab:{}, toolbarPositionForTab:{}, mapExportInProgressTab:{}, mapLastLoadAnnotationReqForTab:{}});
  });
  N(!1);
});
ed();

 
 
