import AsyncStorage from "@react-native-community/async-storage";

// Api settlement Updated func
// **************************************************************************************************************
// const create = (baseURL = 'ttps://www.gomarry.com') => {
//   const api = (headers)=> apisauce.create({
//     // base URL is read from the "constructor"
//     baseURL,
//     headers ,
//     // 10 second timeout...
//     timeout: 10000
//   })
//
//   const baseapi = apisauce.create({
//     baseURL,
//     timeout: 10000
//   })

//   const login = (username,password) =>{ baseapi. }
// }

// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************

const Api = {
  _base: "https://www.gomarry.com",

  _call: (method, parameters) => {
    return new Promise(async (resolve, reject) => {
      var data = new FormData();
      for (var key in parameters) {
        data.append(key, parameters[key]);
      }

      AsyncStorage.getItem("token").then(token => {
        console.log("==========API =====================");
        data.append("token", token);
        global.token = token;
        console.log(token);
        fetch(Api._base + "/api/" + method, {
          method: "POST",
          body: data,
          headers: {
            "X-Auth-Token": token
          }
        })
          .then(response => {
            response.json().then(async response => {
              console.log(response);
              if (response.ok) {
                if (method == "login") {
                  global.token = response.data.token;
                  await AsyncStorage.setItem("token", response.data.token);
                }
                if (method == "register") {
                  global.token = response.data.token;
                  AsyncStorage.setItem("token", response.data.token);
                }
                if (method == "whoami") {
                  global.user = response.data.user;
                  global.username = response.data.user.meta.username;
                  global.sections = response.data.sections;
                  global.attributes = response.data.attributes;
                }
                resolve(response.data);
              } else {
                reject(response.message);
                throw response.message;
              }
            });
          })
          .catch(response => {
            reject(response.message);
            throw response.message;
          });
      });
    });
  },

  uri: uri => {
    return {
      uri: uri,
      headers: {
        "X-Auth-Token": global.token
      }
    };
  },

  login: (username, password) => {
    return Api._call("login", { username: username, password: password });
  },

  logout: () => {
    return Api._call("logout");
  },

  register: (gender, month, day, year, email, password, discovery) => {
    return Api._call("register", {
      gender: gender,
      month: month,
      day: day,
      year: year,
      email: email,
      password: password,
      discovery: discovery
    });
  },

  resendVerificationCode: () => {
    return Api._call("resendVerificationCode", {});
  },

  locationSearch: query => {
    return Api._call("locationSearch", { query: query });
  },

  whoami: () => {
    global.token;
    return Api._call("whoami");
  },

  updateProfile: (section, data) => {
    data["section"] = section;
    return Api._call("updateProfile", data);
  },

  completeSignupStage1: (username, tagline) => {
    return Api._call("complete", {
      stage: 1,
      username: username,
      tagline: tagline
    });
  },

  completeSignupStage2: () => {
    return Api._call("complete", { stage: 2 });
  },

  completeSignupStage3: () => {
    return Api._call("complete", { stage: 3 });
  },

  search: (parameters, page, count) => {
    parameters["page"] = page;
    parameters["count"] = count;

    return Api._call("search", parameters);
  },

  interests: (filter, page, count) => {
    var parameters = {
      filter: filter,
      page: page,
      count: count
    };
    return Api._call("interests", parameters);
  },

  profile: username => {
    var parameters = {
      username: username
    };

    return Api._call("profile", parameters);
  },
  toggleFavourite: friend_id => {
    var parameters = {
      friend_id: friend_id
    };

    return Api._call("toggleFavourite", parameters);
  },

  toggleInvite: friend_id => {
    var parameters = {
      friend_id: friend_id
    };

    return Api._call("toggleInvite", parameters);
  },

  toggleBlocked: friend_id => {
    var parameters = {
      friend_id: friend_id
    };

    return Api._call("toggleBlocked", parameters);
  },
  reset: email => {
    return Api._call("reset", {
      email: email
    });
  },

  changePassword: (current_pass, new_pass, verify_pass) => {
    return Api._call("changePassword", {
      cpass: current_pass,
      npass: new_pass,
      rpass: verify_pass
    });
  },

  changeEmail: (current_email, new_email, verify_email) => {
    return Api._call("changeEmail", {
      cemail: current_email,
      nemail: new_email,
      remail: verify_email
    });
  },
  reportUser: (friend_id, reason) => {
    return Api._call("reportUser", {
      friend_id: friend_id,
      reason: reason
    });
  },
  requests: (filter, page, count) => {
    return Api._call("requests", {
      filter: filter,
      page: page,
      count: count
    });
  },

  photoRequest: (friend_id, album_id) => {
    return Api._call("photoRequest", {
      friend_id: friend_id,
      album_id: album_id
    });
  },

  photoRequestRespond: (request_id, decision) => {
    return Api._call("photoRequestRespond", {
      request_id: request_id,
      decision: decision
    });
  },

  getSurveyQuestion: question_id => {
    return Api._call("getSurveyQuestion", {
      question_id: question_id
    });
  },

  setSurveyAnswer: (question_id, answer, weight, comments) => {
    return Api._call("setSurveyAnswer", {
      question_id: question_id,
      answer: answer,
      weight: weight,
      comments: comments
    });
  },

  updateTagLine: tagline => {
    return Api._call("updateTagLine", {
      tagline: tagline
    });
  },

  deleteAccount: () => {
    return Api._call("deleteAccount", {});
  },
  rotatePicture: (alias, degrees) => {
    return Api._call("rotatePicture", {
      alias: alias,
      degrees: degrees
    });
  },

  defaultPicture: alias => {
    return Api._call("defaultPicture", {
      alias: alias
    });
  },

  deletePicture: alias => {
    return Api._call("deletePicture", {
      alias: alias
    });
  },

  deleteVideo: alias => {
    return Api._call("deleteVideo", {
      alias: alias
    });
  },

  registerDeviceToken(device_id, device_token) {
    return Api._call("registerDeviceToken", {
      device_id: device_id,
      device_token: device_token
    });
  },

  loadMailbox: (mailbox = "all", page) => {
    return Api._call("loadMailbox", {
      mailbox: mailbox
      // page: page
    });
  },

  toggleStarredConversation: friend_id => {
    return Api._call("toggleStarredConversation", {
      friend_id: friend_id
    });
  },

  toggleArchivedConversation: friend_id => {
    return Api._call("toggleArchivedonversation", {
      friend_id: friend_id
    });
  },

  // friend_id: the user id of the other person in the conversation
  loadConversation: (friend_id, message_id, before, mark_as_read, limit) => {
    options = {
      friend_id: friend_id
    };

    if (typeof message_id !== "undefined") options["mid"] = message_id;
    if (typeof before !== "undefined") options["before"] = before ? 1 : 0;
    if (typeof mark_as_read !== "undefined")
      options["markAsRead"] = mark_as_read ? 1 : 0;
    if (typeof limit !== "undefined") options["limit"] = limit;

    return Api._call("loadConversation", options);
  },

  isTypingTo: friend_id => {
    return Api._call("isTypingTo", {
      friend_id: friend_id
    });
  },

  sendMessage: (friend_id, message) => {
    return Api._call("sendMessage", {
      friend_id: friend_id,
      message: message
    });
  },

  // read: 1 for read, 0 for unread
  getNotificationCount: read => {
    return Api._call("getNotificationCount", {
      read: read ? 1 : 0
    });
  },

  getNotifications: (page, itemsPerPage) => {
    return Api._call("getNotifications", {
      page: page,
      itemsPerPage: itemsPerPage
    });
  },

  markNotificationsRead: () => {
    return Api._call("markNotificationsRead", {});
  }
};

export default Api;
