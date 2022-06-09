const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY='F8_PLAYER'
const heading=$('header h2')
const audio=$('#audio')
const playlist=$('.playlist')
const cdThumb=$('.cd-thumb')
const playBtn=$('.btn-toggle-play')
const progress=$('.progress')
const nextBtn=$('.btn-next')
const backBtn=$('.btn-prev')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')
const atSong=$('.song')
const app={
    currentIndex: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs:[
        {
            name:'Ái Nộ',
            singger:'MasewKhôi Vũ',
            path:'./audio/AiNo1-MasewKhoiVu-7078913.mp3',
            image:'./img/1630316309035_300.jpg'
        },
        {
            name:'Đế Vương',
            singger:'Đình DũngACV',
            path:'./audio/DeVuong-DinhDungACV-7121634.mp3',
            image:'./img/1638180197658_300.jpg'
        },
        {
            name:'Chạy Về Nơi Phía Anh',
            singger:'Đình Dũng',
            path:'./audio/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3',
            image:'./img/1644475457323_300.jpg'
        },
        {
            name:'Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh',
            singger:'ERIK',
            path:'./audio/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3',
            image:'./img/1643184497199_300.jpg'
        },
        {
            name:'Sài Gòn Đau Lòng Quá',
            singger:'Hứa Kim Tuyền, Hoàng Duyên',
            path:'./audio/SaiGonDauLongQua-HuaKimTuyenHoangDuyen-6992977.mp3',
            image:'./img/1616859493571_300.jpg'
        },
        {
            name:'Cưới Thôi',
            singger:'Masew, Masiu, B Ray, TAP',
            path:'./audio/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3',
            image:'./img/1631181753902_300.jpg'
        },
        {
            name:' Gác Lại Âu Lo',
            singger:'Da LAB, Miu Lê',
            path:'./audio/GacLaiAuLo-DaLABMiuLe-6360815.mp3',
            image:'./img/1595564868985_300.jpg'
        },
        {
            name:' Trên Tình Bạn Dưới Tình Yêu',
            singger:'MIN',
            path:'./audio/TrenTinhBanDuoiTinhYeu-MIN-6802163.mp3',
            image:'./img/1604574284072_300.jpg'
        },
        {
            name:'Nevada',
            singger:'icetone, Cozi Zuehlsdorff',
            path:'./audio/Nevada-Monstercat-6983746.mp3',
            image:'./img/download-nhac-moi-one-love-flip-capella-md-electro-remix-single-chat-luong-cao.png'
        },
        {
            name:' Summertimeu',
            singger:'Cinnamons,Evening Cinema',
            path:'./audio/Summertime-CinnamonsEveningCinema-6046288.mp3',
            image:'./img/1572504572197.jpg'
        }
    ],
        render:function (){
            const atIndex=this.currentIndex
            const htmls=this.songs.map(function(song,index){
            
                return `
                <div class="song ${index===atIndex?'active':''}" data-index=${index}>
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singger}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
                `
            }).join('')
            playlist.innerHTML =htmls
        },
        defineProperties:function(){
            Object.defineProperty(this,'currentSong',{
                get:function (){
                return this.songs[this.currentIndex]
                }
            })
        },
        scrollToActiveSong: function(){
            setTimeout(function(){
                const atIndex=app.currentIndex
                if(atIndex<=1)
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block:'end'
                    }) 
                else{
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block:'nearest'
                    }) 
                }
            }
            ,300)
        },
        handleEvent: function(){
            const _this=this
            const cd=$('.cd')
            const cdWidth = cd.offsetWidth
            //xử lý quay cd
            const cdThumbAnimate=cdThumb.animate([{
                transform: 'rotate(360deg)'
            }],{
                duration: 14000,//14s
                iterations: Infinity
            })
            cdThumbAnimate.pause()
            //phóng to, thu nhỏ bài hát
            document.onscroll=function(){
                const stcrollTop=window.scrollY||document.documentElement.scrollTop
                const newCdWidth=cdWidth-stcrollTop

                cd.style.width=newCdWidth>0?newCdWidth +'px':0
                cd.style.oppacity=cdWidth/newCdWidth
            }
            //xử lý sự kiến nhấn nút play
            playBtn.onclick=function(){
                if(_this.isPlaying){
                audio.pause()
                }else{
                audio.play()
                }
            }
            //khi bai hát bị play
            audio.onplay=function(){
                _this.isPlaying=true
                audio.play()
                $('.player').classList.add('playing')
                cdThumbAnimate.play()
            }
            //khi bài hát bị pause
            audio.onpause=function(){
                _this.isPlaying=false
                audio.pause()
                $('.player').classList.remove('playing')
                cdThumbAnimate.pause()
            }
            //khi tiến đọ bài hát thay đổi
            audio.ontimeupdate=function(){
                if(audio.duration){
                    const progressPercent= Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value=progressPercent                    
                }
            }
            //xử lý khi tua xong
            progress.onchange=function(e){
                const seekTime=audio.duration / 100* e.target.value
                audio.currentTime=seekTime
            }
            //xử lý khi next 
            nextBtn.onclick=function(){
                if(_this.isRandom){
                    _this.playRandomSong()
                }else{
                    _this.nextSong()
                }
                audio.play()
               _this.render()
               _this.scrollToActiveSong()
            }
            //xử lý khi quay lại
            backBtn.onclick=function(){
                if(_this.isRandom){
                    _this.playRandomSong()
                }else{
                    _this.backSong()
                }
                audio.play()
                _this.render()
            }
            //xử lý khi ấn random
            randomBtn.onclick=function(){
                _this.isRandom=!_this.isRandom
                _this.setConfig('isRandom',_this.isRandom)
                randomBtn.classList.toggle("active",_this.isRandom)
            }
            //xử lý khi hết bài
            audio.onended=function(){
                if(_this.isRepeat){
                    audio.play()
                }else{
                nextBtn.click()
                }
            }
            //xử lý khi phát lại bài hát
            repeatBtn.onclick=function(){
                _this.isRepeat=!_this.isRepeat
                _this.setConfig('isRepeat',_this.isRepeat)
                repeatBtn.classList.toggle('active',_this.isRepeat)
            }
            //xử lý khi chon songs
            playlist.onclick=function(e){
                var nodeSong=e.target.closest('.song:not(.active)')
                if(nodeSong||(e.target.closest('.option'))){
                    if(nodeSong){
                    _this.currentIndex=Number(nodeSong.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    }
                    if((e.target.closest('.option'))){

                    }
                }
            }
        },
        nextSong: function(){
            this.currentIndex++
            if(this.currentIndex>=this.songs.length){
                this.currentIndex=0;
            }
            this.loadCurrentSong()
        },
        backSong: function(){
            this.currentIndex--
            if(this.currentIndex<0){
                this.currentIndex=this.songs.length-1
            }
            this.loadCurrentSong()
        },
        playRandomSong: function(){
            let newIndex 
            do{
                newIndex = Math.floor(Math.random()*this.songs.length)
            }while(newIndex === this.currentIndex)
            this.currentIndex=newIndex
            this.loadCurrentSong()
        },
        loadConfig: function(){
            this.isRandom=this.config.isRandom
            this.isRepeat=this.config.isRepeat
        },
        loadCurrentSong: function(){
            heading.textContent=this.currentSong.name
            cdThumb.style.backgroundImage=`url(${this.currentSong.image})`
            audio.src=this.currentSong.path
        },
        start: function render(){
        //gắn cấu hình từ config vào ứng dụng
            this.loadConfig()
        // định nghĩa thuộc tính cho Object
            this.defineProperties()
            //lắng nghe/xử lý sự kiện
            this.handleEvent()
            //tải bài hát đầu tiên
            this.loadCurrentSong()
            //render playlis ra UI
            this.render()
            //hiển thị trạng thái ban đầu của btn repeat & random
            randomBtn.classList.toggle("active",this.isRandom)
            repeatBtn.classList.toggle('active',this.isRepeat)
        }
}

    app.start()