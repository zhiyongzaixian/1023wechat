import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [], // 导航数据
    navId: '', // 导航的标签id
    videoList: [], // 视频的列表数据
    videoId: '', // 视频id
    videoUpdateTime: [], // 记录视频播放的时长
    triggered: false, // 下拉刷新是否被触发的标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return;
    }
    this.getInitData();
    
  },
  
  // 封装获取导航标签的数据功能函数
  async getInitData(){
    let navListData = await request('/video/group/list');
    this.setData({
      navList: navListData.data.slice(0, 14),
      navId: navListData.data[0].id
    })
  
    this.getVideoList(this.data.navId);
  },
  // 获取视频列表数据
  async getVideoList(navId){
    let videoListData = await request('/video/group' , {id: navId});
    let id = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = id++;
      return item;
    })
    
    // 关闭消息提示框
    wx.hideLoading();
    
    this.setData({
      triggered: false,
      videoList
    })
  },

  // 点击导航的回调
  changeNavId(event){
    // 提示用户正在加载
    wx.showLoading({
      title: '正在加载'
    })
    // console.log(event);
    // let navId = event.currentTarget.dataset.id; // data-key=value
    let navId = event.currentTarget.id; // 会自动将number转换成字符串
    this.setData({
      navId: navId>>>0,
      videoList: [],
    })
  
    this.getVideoList(this.data.navId);
  },
  
  // 点击播放/继续播放的回调
  handlePlay(event){
    /*
    * 问题： 多个视频同时播放
    * 解决思路：
    *   1. 在播放当前视频的时候关闭上一个播放的视频
    *   2. 如何操作关闭视频: videoContext = wx.createVideoContext(vid)
    *   3. 如何找到上一个播放的视频,并且关闭
    *     1) 找到上一个上下文对象
    *     2) 保证两次点击的不是同一个视频再关闭
    * js设计模式： 单例模式
    *   1. 始终保持只有一个对象，如果需要创建新的对象会把之前的覆盖掉， 节省内存空间
    *
    *
    * */
    // 获取当前点击视频的id
    let vid = event.currentTarget.id;
  
  
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // if(this.vid !== vid){
    //   if(this.videoContext){
    //     this.videoContext.stop();
    //   }
    // }
    // 更新videoId的状态
    this.setData({
      videoId: vid
    })
    // this.vid = vid;
    this.videoContext = wx.createVideoContext(vid);
    
    // 判断当前是否之前是否播放过，如果播放过，跳转至指定的位置
    let {videoUpdateTime} = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){// 播放过
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();
    // this.videoContext.stop();
    
  },
  
  // 视频播放进度发生改变的回调
  handleTimeUpdate(event){
    // console.log(event);
    // 1. 收集当前视频的数据
    let videoObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    // 2. 存入数据至videoUpdateTime中
    /*
    * 思路：
    *   1. 用来存放视频播放进度的数组中是否已经有当前视频的数据
    *     1) 没有： 直接push
    *     2) 已有： 在原有的基础上直接修改currentTime
    *
    * */
    let {videoUpdateTime} = this.data;
    // [{vid: xx, currentTime: yyy}]
    let videoItem = videoUpdateTime.find(item => item.vid === videoObj.vid);
    if(videoItem){ // 已有
      videoItem.currentTime = event.detail.currentTime;
    }else { // 没有
      videoUpdateTime.push(videoObj);
    }
    
    this.setData({
      videoUpdateTime
    })
  },
  
  // 视频播放结束的回调
  handleEnded(event){
    // console.log('ended');
    let {videoUpdateTime} = this.data;
    let vid = event.currentTarget.id;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === vid), 1);
    this.setData({
      videoUpdateTime
    })
  },
  
  // scroll-view的下拉刷新事件
  handleRefresher(){
    console.log('scroll-view下拉刷新');
    // 发送请求获取最新的视频数据
    this.getVideoList(this.data.navId);
  },
  
  // scroll-view 上拉触底
  handleToLower(){
    console.log('scroll-view上拉触底');
    // 加载更多数据： 分页
    /*
    * 分页：
    *   1. 前端分页
    *   2. 后端分页
    * 场景： 数据源数组中有100条数据， 页面一次显示10条
    *   1) 前端： 后端会统一的将100条的数组一次性返回，由前端对数组进行分割操作，一次取10条数据显示
    *   2) 后端分页：
    *     1. 后端一次返回的数据只有10条，切割数组的动作发生在后端
    *     2. 需要前端发请求携带参数： page页数 & size数据量的大小
    *
    * */
    let newVideoList = [
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_5B03FF4436E98988EF563AB72D6956F8",
          "coverUrl": "https://p1.music.126.net/D9VwRj8Mz3LLGTjRNofBiw==/109951163936793919.jpg",
          "height": 720,
          "width": 1280,
          "title": "EXO二巡演唱会《Baby, Don't Cry (人鱼的眼泪)》",
          "description": null,
          "commentCount": 354,
          "shareCount": 688,
          "resolutions": [
            {
              "resolution": 240,
              "size": 37621689
            },
            {
              "resolution": 480,
              "size": 67055191
            },
            {
              "resolution": 720,
              "size": 85876449
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 510000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/YEMppBntsxrQs9MkTjEIXg==/109951165412235772.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 510100,
            "birthday": 1033543411827,
            "userId": 391679147,
            "userType": 204,
            "nickname": "朴先生的怀中猫",
            "signature": "🍒 EXO|本命灿白勋|认识你们是我最大的幸运🍒",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165412235780,
            "backgroundImgId": 109951165382680080,
            "backgroundUrl": "http://p1.music.126.net/8C5_IengFRDegr_r2OAVjg==/109951165382680086.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951165412235772",
            "backgroundImgIdStr": "109951165382680086",
            "avatarImgId_str": "109951165412235772"
          },
          "urlInfo": {
            "id": "5B03FF4436E98988EF563AB72D6956F8",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/xwyUXxAi_2386635738_shd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=wBBbmUnSQMWOtabNvnKkEwKuONzHOuqU&sign=815d7570409330366ec216cd1a4ab4ad&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 85876449,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 10115,
              "name": "EXO",
              "alg": "groupTagRank"
            },
            {
              "id": 9102,
              "name": "演唱会",
              "alg": "groupTagRank"
            },
            {
              "id": 57107,
              "name": "韩语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "5B03FF4436E98988EF563AB72D6956F8",
          "durationms": 360000,
          "playTime": 572526,
          "praisedCount": 6464,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_AEAE0D524CD4891F414867A14F69AEFC",
          "coverUrl": "https://p1.music.126.net/IeD2XXGDRbKb_4Kn96tf7Q==/109951165062600758.jpg",
          "height": 1080,
          "width": 1920,
          "title": "摇滚酵母菌“仙儿”-二手玫瑰",
          "description": "中国摇滚教父多，摇滚教母只有一个！",
          "commentCount": 16,
          "shareCount": 23,
          "resolutions": [
            {
              "resolution": 240,
              "size": 22730664
            },
            {
              "resolution": 480,
              "size": 38745335
            },
            {
              "resolution": 720,
              "size": 56071119
            },
            {
              "resolution": 1080,
              "size": 97714199
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 610000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/WuZssS7Exa8n3vou-uXj5Q==/109951164481543941.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 610100,
            "birthday": 740160000000,
            "userId": 277740471,
            "userType": 0,
            "nickname": "鬼谷縱橫君",
            "signature": "萬世千秋時代變，皆于合縱連橫間。                         ——縱橫君",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164481543940,
            "backgroundImgId": 109951164481545900,
            "backgroundUrl": "http://p1.music.126.net/stSqPSrBApmT8YfmW8wrNg==/109951164481545902.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164481543941",
            "backgroundImgIdStr": "109951164481545902",
            "avatarImgId_str": "109951164481543941"
          },
          "urlInfo": {
            "id": "AEAE0D524CD4891F414867A14F69AEFC",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/U1f8AyXs_3029695210_uhd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=xiqfptrbCwycubSOtdSjVbgaCkcviDlQ&sign=3694c640e1f45831c07eb0669b4c3ebe&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 97714199,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 4105,
              "name": "摇滚",
              "alg": "groupTagRank"
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "仙儿 (Live)",
              "id": 1357856747,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 11514,
                  "name": "二手玫瑰",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": "",
              "fee": 8,
              "v": 6,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 78429118,
                "name": "如你所愿",
                "picUrl": "http://p3.music.126.net/IASIhnr73jJdkL5f6lopYA==/109951163988992581.jpg",
                "tns": [],
                "pic_str": "109951163988992581",
                "pic": 109951163988992580
              },
              "dt": 263999,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 10562917,
                "vd": -2
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 6337768,
                "vd": -2
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 4225193,
                "vd": -2
              },
              "a": null,
              "cd": "01",
              "no": 4,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "mst": 9,
              "cp": 1416873,
              "mv": 10909543,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1554739200000,
              "privilege": {
                "id": 1357856747,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 64,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "AEAE0D524CD4891F414867A14F69AEFC",
          "durationms": 252118,
          "playTime": 39709,
          "praisedCount": 148,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_69D6809DAE97ADAAB57A898DB03897DE",
          "coverUrl": "https://p1.music.126.net/9zJ0ZOVOf9Show-dJtR__w==/109951163725643376.jpg",
          "height": 540,
          "width": 960,
          "title": "古筝小姐姐的外国街头弹奏《刀剑如梦》，很受欢迎。",
          "description": "古筝小姐姐的外国街头弹奏《刀剑如梦》，热情的老奶奶竟然也唱了起来！国粹文化出国，很棒！",
          "commentCount": 842,
          "shareCount": 856,
          "resolutions": [
            {
              "resolution": 240,
              "size": 4808130
            },
            {
              "resolution": 480,
              "size": 8129867
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/4jCjuy8MzsU5x9chEj6WzQ==/109951163536519595.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 110101,
            "birthday": -2209017600000,
            "userId": 320880971,
            "userType": 202,
            "nickname": "音乐热点通",
            "signature": "十九线热点",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163536519600,
            "backgroundImgId": 2002210674180198,
            "backgroundUrl": "http://p1.music.126.net/i0qi6mibX8gq2SaLF1bYbA==/2002210674180198.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "视频达人(华语、音乐现场)",
              "2": "音乐|生活图文达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163536519595",
            "backgroundImgIdStr": "2002210674180198",
            "avatarImgId_str": "109951163536519595"
          },
          "urlInfo": {
            "id": "69D6809DAE97ADAAB57A898DB03897DE",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/F0p5KvJr_2188036431_hd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=brMVAYJBuvojmVfQwtevNBXxQVpsuvhs&sign=6e346a3f42d39077ca18844846cc7d14&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 8129867,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 480
          },
          "videoGroup": [
            {
              "id": -14438,
              "name": "#【大街小巷系列】经典怀旧金曲！#",
              "alg": "groupTagRank"
            },
            {
              "id": 96102,
              "name": "周华健",
              "alg": "groupTagRank"
            },
            {
              "id": 15225,
              "name": "古筝",
              "alg": "groupTagRank"
            },
            {
              "id": 59106,
              "name": "街头表演",
              "alg": "groupTagRank"
            },
            {
              "id": 254120,
              "name": "滚石唱片行",
              "alg": "groupTagRank"
            },
            {
              "id": 4110,
              "name": "古风",
              "alg": "groupTagRank"
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "刀剑如梦",
              "id": 5271860,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 6456,
                  "name": "周华健",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [
                "1994版台视版《倚天屠龙记》主题曲"
              ],
              "pop": 100,
              "st": 0,
              "rt": "600902000009585709",
              "fee": 8,
              "v": 688,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 513052,
                "name": "电视剧歌曲大全",
                "picUrl": "http://p4.music.126.net/n_7R-J0uWaBPBkm7aVsA_Q==/122045790701114.jpg",
                "tns": [],
                "pic": 122045790701114
              },
              "dt": 188000,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7542215,
                "vd": 2035
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4525386,
                "vd": -2
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3016971,
                "vd": 2193
              },
              "a": null,
              "cd": "1",
              "no": 13,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "mst": 9,
              "cp": 684010,
              "mv": 0,
              "rtype": 0,
              "rurl": null,
              "publishTime": 991065600000,
              "privilege": {
                "id": 5271860,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 320000,
                "fl": 128000,
                "toast": false,
                "flag": 256,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "69D6809DAE97ADAAB57A898DB03897DE",
          "durationms": 29838,
          "playTime": 3660378,
          "praisedCount": 13081,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_EE0C165DF90BC9B44F09548611C248AB",
          "coverUrl": "https://p1.music.126.net/egekaziG_UM_brtDfm3XYg==/109951163693588988.jpg",
          "height": 720,
          "width": 1280,
          "title": "林俊杰第29届金曲奖颁奖典礼压轴表演十分钟六首金曲串烧",
          "description": "林俊杰第29届金曲奖颁奖典礼压轴表演，十分钟六首金曲串烧：《江南》《可惜没如果》《西界》《伟大的渺小》《第几个一百天》、《不为谁而作的歌》，声色动人，唯美动听，CD林的又一次完美现场演绎！",
          "commentCount": 645,
          "shareCount": 1164,
          "resolutions": [
            {
              "resolution": 240,
              "size": 66492965
            },
            {
              "resolution": 480,
              "size": 114085536
            },
            {
              "resolution": 720,
              "size": 174005685
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 320000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/HQisHY2Y9e7A0j2-7ZiYtQ==/18549860674139236.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 320100,
            "birthday": 537280839680,
            "userId": 46913126,
            "userType": 204,
            "nickname": "音乐谷主",
            "signature": "新浪微博@音乐谷主，最爱会唱歌的歌手！合作qq1480392138，微信yinygz",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18549860674139236,
            "backgroundImgId": 18755469348577256,
            "backgroundUrl": "http://p1.music.126.net/rUZIeySSs3RQILoElc3_Xg==/18755469348577255.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "18549860674139236",
            "backgroundImgIdStr": "18755469348577255",
            "avatarImgId_str": "18549860674139236"
          },
          "urlInfo": {
            "id": "EE0C165DF90BC9B44F09548611C248AB",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/fCx3L0bB_2150654358_shd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=xIWQEQvtoNmPOOQDUjisFhWpxQUXDZPf&sign=44deb9ee18a3ca79855c9cd8f266d465&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 174005685,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 11110,
              "name": "林俊杰",
              "alg": "groupTagRank"
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "EE0C165DF90BC9B44F09548611C248AB",
          "durationms": 646235,
          "playTime": 2017991,
          "praisedCount": 10888,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_77AB8DAF2A4B1A748611950C7A3FF2C9",
          "coverUrl": "https://p1.music.126.net/Jhso48bbUafKv78cJRw82g==/109951164633857620.jpg",
          "height": 360,
          "width": 640,
          "title": "夜店-钟嘉欣 -DJ版- 月亮代表我的心",
          "description": "",
          "commentCount": 14,
          "shareCount": 36,
          "resolutions": [
            {
              "resolution": 240,
              "size": 40386009
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 430000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/2dIpW7snGMw1wDFbFxUODg==/109951164848483045.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 431000,
            "birthday": 660412800000,
            "userId": 58280760,
            "userType": 4,
            "nickname": "Dj建斌",
            "signature": "音为有你，所以快乐。（喜欢请☞+关注）",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164848483040,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164848483045",
            "backgroundImgIdStr": "109951162868126486",
            "avatarImgId_str": "109951164848483045"
          },
          "urlInfo": {
            "id": "77AB8DAF2A4B1A748611950C7A3FF2C9",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/5t0y74WW_2880741302_sd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=LNcJnDLlBYVquJMWRVxQMdJsjrvcITOp&sign=3734550a19bcfdc165fc3cb807fcdca3&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 40386009,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 240
          },
          "videoGroup": [
            {
              "id": 72116,
              "name": "短片",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "77AB8DAF2A4B1A748611950C7A3FF2C9",
          "durationms": 226429,
          "playTime": 129865,
          "praisedCount": 238,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_EC7966931A94E181596E4EDC4C09221E",
          "coverUrl": "https://p1.music.126.net/wsmB3D8Twu7afNr1fOscgw==/109951164906687893.jpg",
          "height": 1080,
          "width": 1920,
          "title": "LiSA不愧是神曲制造机，战歌一响，宅男集体疯狂",
          "description": "LiSA不愧是神曲制造机，战歌一响，宅男集体疯狂！LiSA，织部里沙，歌手，演唱会，现场，动漫神曲，流行音乐",
          "commentCount": 49,
          "shareCount": 16,
          "resolutions": [
            {
              "resolution": 240,
              "size": 41008233
            },
            {
              "resolution": 480,
              "size": 82572003
            },
            {
              "resolution": 720,
              "size": 117445537
            },
            {
              "resolution": 1080,
              "size": 176976859
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 610000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/10O0aLYURMQ63djHmQiODA==/109951164139329684.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 610100,
            "birthday": -2209017600000,
            "userId": 1764039625,
            "userType": 204,
            "nickname": "最电台",
            "signature": "音乐最电台，华语乐风范！",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164139329680,
            "backgroundImgId": 109951164938261100,
            "backgroundUrl": "http://p1.music.126.net/1UcHQv42H9AwYxaHoIRroA==/109951164938261101.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164139329684",
            "backgroundImgIdStr": "109951164938261101",
            "avatarImgId_str": "109951164139329684"
          },
          "urlInfo": {
            "id": "EC7966931A94E181596E4EDC4C09221E",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/KJXc5aPU_2971263713_uhd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=EAzNWpTotWXYwBpLIYmxjEsPVccxuRMa&sign=5bbc2871f3d8ea7f22ebcea29ae104ad&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 176976859,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 26138,
              "name": "日本明星",
              "alg": "groupTagRank"
            },
            {
              "id": 60101,
              "name": "日语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "EC7966931A94E181596E4EDC4C09221E",
          "durationms": 230866,
          "playTime": 308679,
          "praisedCount": 995,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_6ACCD71C275E6B989A395F9E72C0E370",
          "coverUrl": "https://p1.music.126.net/htRZInTED9MTXVqULt_tyg==/109951164728736612.jpg",
          "height": 720,
          "width": 1280,
          "title": "【猴姆独家】火辣！P叔#Pitubll#最新现场连唱热单",
          "description": "【猴姆独家】火辣！P叔#Pitubll#最新现场连唱热单Get Ready、3 To Tango和Cinco De Mayo！还有#约翰·特拉沃尔塔#、Lil Jon等助阵表演！！",
          "commentCount": 21,
          "shareCount": 49,
          "resolutions": [
            {
              "resolution": 240,
              "size": 86549058
            },
            {
              "resolution": 480,
              "size": 153804448
            },
            {
              "resolution": 720,
              "size": 190274733
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/Kaawi0boZPG2yqWcGBVPUw==/109951163650265399.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 110101,
            "birthday": 480787200000,
            "userId": 1659930059,
            "userType": 0,
            "nickname": "Houson猴姆",
            "signature": "这货就是【猴姆独家】！",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163650265390,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "视频达人(欧美、影视、音乐现场)"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951163650265399",
            "backgroundImgIdStr": "109951162868126486",
            "avatarImgId_str": "109951163650265399"
          },
          "urlInfo": {
            "id": "6ACCD71C275E6B989A395F9E72C0E370",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/bH5o8kan_2912812412_shd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=NNKxouwLYrwlexBWJuMcJMNyccBSllnX&sign=42143e59af5bc0c9666300bf91d1aa1a&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 190274733,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": "groupTagRank"
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "6ACCD71C275E6B989A395F9E72C0E370",
          "durationms": 383896,
          "playTime": 80445,
          "praisedCount": 287,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_8E2698DBE09680FEFBB6958DF4F74CA1",
          "coverUrl": "https://p2.music.126.net/OBxG2BqGHHcgiv8qi6mcxQ==/109951163845289733.jpg",
          "height": 360,
          "width": 640,
          "title": "【2019炸】A$AP Rocky 与 Drake 同台表演二人火热单曲！",
          "description": "【2019炸】A$AP Rocky 与 Drake 同台表演二人火热单曲！\n\nFuckin Problems - Nonstop - Sicko Mode",
          "commentCount": 220,
          "shareCount": 437,
          "resolutions": [
            {
              "resolution": 1080,
              "size": 288151815
            },
            {
              "resolution": 720,
              "size": 194660580
            },
            {
              "resolution": 480,
              "size": 132444617
            },
            {
              "resolution": 240,
              "size": 75562948
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 310000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/Cf2JKBDOZr6AAdfgFuz2YA==/109951163470999606.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 310101,
            "birthday": -1565251200000,
            "userId": 344052772,
            "userType": 4,
            "nickname": "Geminiboyz",
            "signature": "双胞胎。 B站：Geminiboyz / 微博：Gemini-Boyz",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163470999600,
            "backgroundImgId": 109951163470998780,
            "backgroundUrl": "http://p1.music.126.net/qYEOfIALO3ThHhSVv0yFsA==/109951163470998781.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951163470999606",
            "backgroundImgIdStr": "109951163470998781",
            "avatarImgId_str": "109951163470999606"
          },
          "urlInfo": {
            "id": "8E2698DBE09680FEFBB6958DF4F74CA1",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/WS5Rqs33_2299946191_uhd.mp4?ts=1603770492&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=BEKToeWCJBtfqyJmTCakbiagGRovlPVF&sign=dd894db067ef5da147a1b5f4de753b50&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Say3SDPo7HOccbQvzmpjgGjCrVL0KYSozkoYEDt86qv2EbchEgdA0U500HTXtazpyTJVr/90vuEEXgL3mvg6UN04fpZBI8zCBmrkoZi90OGD7",
            "size": 288151815,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": -27564,
              "name": "#$•Trap&hiphop•$#",
              "alg": "groupTagRank"
            },
            {
              "id": 57110,
              "name": "饭拍现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Nonstop",
              "id": 574926583,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 53283,
                  "name": "Drake",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 233,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 39791361,
                "name": "Scorpion",
                "picUrl": "http://p3.music.126.net/I4xRY1Nd46fygwWIRY63DA==/109951163381683537.jpg",
                "tns": [],
                "pic_str": "109951163381683537",
                "pic": 109951163381683540
              },
              "dt": 238613,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 9547276,
                "vd": -2
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5728383,
                "vd": -2
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3818937,
                "vd": -2
              },
              "a": null,
              "cd": "1",
              "no": 2,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "mst": 9,
              "cp": 7003,
              "mv": 10754230,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1530201600007,
              "privilege": {
                "id": 574926583,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 4,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "8E2698DBE09680FEFBB6958DF4F74CA1",
          "durationms": 406118,
          "playTime": 414153,
          "praisedCount": 2373,
          "praised": false,
          "subscribed": false
        }
      }
    ];
    let {videoList} = this.data;
    videoList.push(...newVideoList);
    this.setData({
      videoList
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('页面下拉刷新。。。');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底。。。');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
