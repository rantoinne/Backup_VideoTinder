const defaultState = {
  user: {},
  popularVideos: [],
  likedVideos: [],
  newVideos: [],
};

export default function tasksReducer (state = defaultState, action) {
  switch (action.type) {
    case 'save-user-data':
    return {
      ...state,
      user: action.user
    }

    case 'save-popular-videos-data':
    return {
      ...state,
      popularVideos: action.popularVideos
    }

    case 'save-liked-videos-data':
    return {
      ...state,
      likedVideos: action.likedVideos
    }

    case 'save-new-videos-data':
    return {
      ...state,
      newVideos: action.newVideos
    }

    // case 'save-current-index':
    // return action.index;

    case 'update-videos-data':
    // console.log("tasks ka payload", action.payload)
    return {
      ...state,
      popularVideos: state.popularVideos.map(video => {
        if(video.userId == action.payload.userId){
          return ({...video, followingUser: action.payload.follow})
        }
        else {
          return video;
        }

      }),
      likedVideos: state.likedVideos.map(video => {
        if(video.userId == action.payload.userId){
          return ({...video, followingUser: action.payload.follow})
        }
        else {
          return video;
        }

      }),
      newVideos: state.newVideos.map(video => {
        if(video.userId == action.payload.userId){
          return ({...video, followingUser: action.payload.follow})
        }
        else {
          return video;
        }

      })
    }

    case 'tasks-complete-item':
    return state;

    default:
    return state;
    }
}

export function saveUserData(user) {
    // console.log(user);
    // console.log("Redux Implememtation",user);
    return {
        type: 'save-user-data',
        user: user
    };
}

// export function saveCurrentIndex(index) {
//     // console.log(user);
//     // console.log("Redux Implememtation",user);
//     return {
//         type: 'save-current-index',
//         index: index
//     };
// }

export function savePopularVideosData(videos) {
    // console.log(videos);
    // console.log("Redux Implememtation for Popular videos");
    return {
        type: 'save-popular-videos-data',
        popularVideos: videos
    };
}

export function saveLikedVideosData(videos) {
    // console.log(videos);
    // console.log("Redux Implememtation for liked videos");
    return {
        type: 'save-liked-videos-data',
        likedVideos: videos
    };
}

export function saveNewVideosData(videos) {
    // console.log(videos);
    // console.log("Redux Implememtation for liked videos");
    return {
        type: 'save-new-videos-data',
        newVideos: videos
    };
}

export function updateVideosData(userId, follow) {
    // console.log(videos);
    // console.log("Update Implememtation for Popular videos", userId, follow );
    return {
        type: 'update-videos-data',
        payload: {userId, follow}
    };
}
