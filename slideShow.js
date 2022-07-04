// SlideShow trait
const SlideShow = function (option) {
    this.slideShowEl = option.slideShowName;              //SlideShow parentElement
    this.imgCount = option.imgName;                    //SlideShow imgCount
    this.imgWidth = null;                    //SlideShow imgWidth
    this.imgIndex = 0;                                  //SlideShow start location
    this.Lock = false;                                  //函数节流，声明一个锁
    this.transitionTime = option.Time;        //图片过度效果时间
    this.someBtnEl = option.BtnName;            //按钮控件名称
    this.arrowLeft = option.left;       //左箭头类名
    this.arrowRight = option.right;     //右箭头类名
    this.SlideShowBox = option.imgBox
}

SlideShow.prototype.init = function () {
    //获取小按钮元素
    if (this.someBtnEl) {
        this.someBtnEl = document.querySelectorAll('.' + this.someBtnEl)
        this.someBtn(this.someBtnEl)
    }
    //获取轮播图元素
    if (this.slideShowEl) {
        this.slideShowEl = document.querySelector('.' + this.slideShowEl)
    }
    // 获取图片数量和宽度
    if (this.imgCount) {
        let imgEl = document.querySelectorAll('.' + this.imgCount)
        this.imgCount = imgEl.length;
        // this.imgWidth =
        this.imgWidth = (getComputedStyle(imgEl[0], null).width).replace('px', '');
        console.log(typeof this.imgWidth);
    }
    //获取箭头元素并设置点击事件
    if (this.arrowLeft && this.arrowRight) {
        this.arrowLeft = document.querySelector('.' + this.arrowLeft);
        this.arrowRight = document.querySelector('.' + this.arrowRight);
        this.arrows(this.arrowLeft, this.arrowRight);
    }
    // 获取轮播图盒子元素
    if (this.SlideShowBox ) {
        this.SlideShowBox = document.querySelector('.' + this.SlideShowBox);
    }
    let last = this.slideShowEl.children[0].cloneNode(true);
    this.slideShowEl.appendChild(last)
    this.someBtnColor(this.someBtnEl)
}

//判断轮播图特征是否为空
SlideShow.prototype.judgeTrait = async function () {

    return new Promise((resolve, reject) => {
        if (!this.slideShowEl && !this.imgWidth) {
            reject('数据不全');
        } else {
            resolve('数据正确')
        }
    })
}

//轮播图移动事件
SlideShow.prototype.slideShowMoves = async function (select = true) {
    try {
        let a = await this.judgeTrait()
    } catch (e) {
        console.log(e);
        return
    }
    let transitionTime = this.transitionTime / 1000;
    let slideShowEl = this.slideShowEl
    if (select) {
        // 右移动
        if (this.Lock) return;
        this.imgIndex++;
        this.someBtnColor(this.someBtnEl);
        if (this.imgIndex == this.imgCount) {
            setTimeout(() => {
                this.imgIndex = 0;
                this.slideShowEl.style.transition = `none`;
                this.slideShowEl.style.marginLeft = `-${this.imgIndex * this.imgWidth}px`;
            }, this.transitionTime)
        }
        slideShowEl.style.transition = `${transitionTime}s ease`;
        slideShowEl.style.marginLeft = `-${this.imgIndex * this.imgWidth}px`;
        this.Lock = true;
        setTimeout(() => {
            this.Lock = false;
        }, this.transitionTime);
    } else {
        // 左移动
        if (this.Lock) return;
        this.imgIndex--;
        this.someBtnColor(this.someBtnEl)
        slideShowEl.style.transition = `${transitionTime}s ease`;
        if (this.imgIndex == -1) {
            this.imgIndex = this.imgCount;
            slideShowEl.style.transition = '0s';
            slideShowEl.style.marginLeft = `-${this.imgIndex * this.imgWidth}px`;
            setTimeout(() => {
                this.imgIndex--;
                slideShowEl.style.transition = `${transitionTime}s ease`;
                slideShowEl.style.marginLeft = `-${this.imgIndex * this.imgWidth}px`;
            }, 0)
        }
        slideShowEl.style.marginLeft = `-${this.imgIndex * this.imgWidth}px`;
        console.log(this.imgIndex);
        this.Lock = true;
        setTimeout(() => {
            this.Lock = false;
        }, transitionTime);
    }
}
//轮播图左右箭头事件
SlideShow.prototype.arrows = function (arrowLeft, arrowRight) {
    arrowLeft.addEventListener('click', () => {
        this.slideShowMoves(false);
    })
    arrowRight.addEventListener('click', () => {
        this.slideShowMoves(true);
    })
}
//轮播图小按钮颜色判定
SlideShow.prototype.someBtnColor = function (btn) {
    if (!btn) return;
    btn.forEach((element, index) => {
        let indexs = this.imgIndex == -1
            ? 2
            : this.imgIndex == this.imgCount
                ? 0
                : this.imgIndex
        if (index == indexs) {
            element.style.background = 'white'
        } else {
            element.style.background = ''
        }
    });
}
SlideShow.prototype.someBtn = function (btn = this.someBtnEl) {
    // console.log('1');
    if (!btn) return;
    let transitionTime = this.transitionTime / 1000;
    btn.forEach(element => {
        element.addEventListener('click', (e) => {
            let imgIndexs = e.target.getAttribute('data-index');
            if (!imgIndexs) {
                console.log('img没有data-index属性(属性值即与图片索引相对应)');
                return;
            }
            this.imgIndex = imgIndexs
            this.slideShowEl.style.transition = `${transitionTime}s ease`;
            this.slideShowEl.style.marginLeft = `-${this.imgIndex * this.imgWidth}px`;
            this.someBtnColor(btn)
        })
    })
}
//定时器 轮播图自动播放
SlideShow.prototype.timer = function (time = 2000) {
    let SlideShowTimerId = setInterval(() => {
        this.slideShowMoves()
    }, time);
    this.SlideShowBox.addEventListener('mouseenter', () => {
        clearInterval(SlideShowTimerId);
    })
    this.SlideShowBox.addEventListener('mouseleave', () => {
        if (SlideShowTimerId) {
            clearInterval(SlideShowTimerId);
        }
        SlideShowTimerId = setInterval(() => {
            this.slideShowMoves()
        }, time);
    })
}