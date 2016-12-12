(function () {

    class Pagination {

        constructor(opt) {
            if (!opt.api) {
                throw new Error('请提供Api')
            }

            if (!opt.pageWrapper) {
                throw new Error('请提供分页容器')
            }

            this.pageWrapper = opt.pageWrapper
            this.currentPage = opt.currentPage || 1
            this.totalPage = opt.totalPage || 1
            this.perPage = opt.perPage || 2
            this.api = opt.api
            this.renderContent = opt.renderContent || function(data) { console.log(data) }

            this.init()
        }

        init() {
            this.render()
            this.bindEvent()
        }

        bindEvent() {

            this.pageWrapper.addEventListener('click', (e) => {
                let target = e.target
                if (target.classList.contains('page')) {
                    if (target.classList.contains('disabled')) {
                        return false
                    } else {
                        this.currentPage = target.dataset.page
                        this.render()
                    }
                }

            }, false)
        }

        render() {
            this.fetchData()
                .then((res) => {
                    this.currentPage = res.data.currentPage
                    this.totalPage = res.data.totalPage
                    this.pageWrapper.innerHTML = this.renderPageList()
                    this.renderContent(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        renderPageList() {
            let currentPage = parseInt(this.currentPage),
                totalPage = parseInt(this.totalPage),
                _html = '',
                prePage,
                nextPage,
                firstPage,
                lastPage


            if (currentPage == 1) {
                firstPage = `<li class="page disabled">首页</li>`
            } else {
                firstPage = `<li class="page" data-page="1">首页</li>`
            }


            if (currentPage == totalPage) {
                lastPage = `<li class="page disabled">最后一页</li>`
            } else {
                lastPage = `<li class="page" data-page=${totalPage}>最后一页</li>`
            }

            if (currentPage >= 2) {
                prePage = `<li class="page" data-page=${currentPage - 1}>前一页</li>`
            } else {
                prePage = `<li class="page disabled">前一页</li>`
            }


            if (currentPage < totalPage) {
                nextPage = `<li class="page" data-page=${currentPage + 1}>后一页</li>`
            } else {
                nextPage = `<li class="page disabled">后一页</li>`
            }

            _html += firstPage
            _html += prePage

            for (let i = 1; i <= totalPage; i++) {
                if (currentPage == i) {
                    _html += `<li class="page current-page" data-page=${i}>${i}</li>`
                } else {
                    _html += `<li class="page" data-page=${i}>${i}</li>`
                }
            }

            _html += nextPage
            _html += lastPage

            return _html

        }

        fetchData() {
            return axios.post(this.api, {
                currentPage: this.currentPage,
                perPage: this.perPage
            })
        }
    }

    const movieWrapper = document.querySelector('.movie-list')


    function renderContent(data) {
        let html = data.movies && data.movies.map((movie) => {
            return `<li data-id=${movie.id}><h2>${movie.name}</h2><p>${movie.desc}</p></li>`
        }).join('')                
        
        movieWrapper.innerHTML = html
    }


    const pageInstance = new Pagination({
        pageWrapper: document.querySelector('.pagination'),
        api: 'http://localhost:3000/api/test',
        currentPage: 1,
        perPage: 2,
        renderContent: renderContent
    })

})()