// ===== 新デザインシステム JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== ナビゲーション =====
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // モバイルメニューの開閉
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // ナビゲーションリンクのクリック処理
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // index.html以外ではデフォルト遷移を許可
            if (!location.pathname.endsWith('index.html') && !location.pathname.endsWith('/')) {
                return; // 何もせず通常のリンク遷移
            }
            e.preventDefault();
            
            // アクティブクラスの更新
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // スムーズスクロール
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // モバイルメニューを閉じる
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // ===== スクロール時のヘッダー処理 =====
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // ヘッダーの背景透明度調整
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // アクティブセクションの検出
        updateActiveNavigation();
        
        lastScrollTop = scrollTop;
    });

    // ===== アクティブナビゲーションの更新 =====
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== スクロールアニメーション =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // アニメーション対象要素の監視
    const animateElements = document.querySelectorAll('.work-card, .about-content, .skills-section, .timeline-section');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ===== ワークカードのホバーエフェクト強化 =====
    const workCards = document.querySelectorAll('.work-card');
    
    workCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== スムーズスクロール（ヒーローセクションのボタン） =====
    const heroButtons = document.querySelectorAll('.hero-actions .btn');
    
    heroButtons.forEach(button => {
        if (button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // ===== パフォーマンス最適化：画像の遅延読み込み =====
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // 画像の読み込みをトリガー
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // ===== キーボードナビゲーション対応 =====
    document.addEventListener('keydown', function(e) {
        // Escキーでモバイルメニューを閉じる
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // ===== フォーカス管理 =====
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });

    // ===== レスポンシブ対応：ウィンドウリサイズ処理 =====
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // ウィンドウサイズが変更された時の処理
            if (window.innerWidth > 768 && navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }, 250);
    });

    // ===== 初期化完了ログ =====
    console.log('Portfolio site initialized successfully!');
});

// Heroセクションのアニメーションをページロード時にトリガー
window.addEventListener('DOMContentLoaded', () => {
  // すでにCSSアニメーションが遅延付きで設定されているため、
  // JSでの追加制御は不要ですが、
  // もしスクロール時やインタラクションで追加アニメーションをしたい場合はここに記述
});

// ===== Other Works（全workページ共通）自動生成 =====
const workList = [
  {
    id: 'work13.html',
    title: '書籍横断検索アプリ',
    desc: '複数の図書館・書店を一括検索できるWebアプリ',
    img: './images/booksearch.png',
    link: './work13.html',
  },
  {
    id: 'work9.html',
    title: '串かつ さじろう様<br>リニューアル',
    desc: '全6ページをフルスタック〜CMS化まで実装',
    img: './images/串かつ.png',
    link: './work9.html',
  },
  {
    id: 'work12.html',
    title: '五料産業株式会社様<br>コーポレートサイト制作',
    desc: 'Figmaで作成されたデザインを忠実に再現。2つのデザイン案を実装',
    img: './images/Screenshot 2025-12-30 at 5.31.09.png',
    link: './work12.html',
  },
  {
    id: 'work11.html',
    title: 'メディパ様（美容医療）<br>サービス全般制作',
    desc: 'Googleのビジネスコンテストで優勝したチームのサービス',
    img: './images/medipatop.png',
    link: './work11.html',
  },
  {
    id: 'work3.html',
    title: 'HEART&BRAIN様 <br>LP制作',
    desc: 'パララックス効果で奥行きのある流行のデザイン',
    img: './images/HB.png',
    link: './work3.html',
  },
  {
    id: 'work10.html',
    title: 'VEIN ENERGY様<br>コーポレート',
    desc: 'ロゴ制作から実装まで3日で納品。',
    img: './images/VE.png',
    link: './work10.html',
  },
  {
    id: 'work.html',
    title: 'ぎふ就労支援センター様<br>リニューアル',
    desc: '大規模リニューアル案件',
    img: './images/Screenshot 2025-05-07 at 17.59.08.png',
    link: './work.html',
  },
  {
    id: 'work5.html',
    title: 'Coffee <br>コーポレート',
    desc: 'Reactを使用したモダンなコーポレートサイト',
    img: './images/Screenshot 2025-07-13 at 8.58.05.png',
    link: './work5.html',
  },
];

function renderOtherWorksSlider(currentId) {
  const sliderGrid = document.querySelector('.related-works-grid');
  if (!sliderGrid) return;
  sliderGrid.innerHTML = '';
  workList.filter(w => w.id !== currentId).forEach(work => {
    const card = document.createElement('article');
    card.className = 'work-card';
    const imgStyle = (work.img.includes('串かつ') || work.img.includes('medipatop') || work.img.includes('VE.png')) 
      ? 'style="object-position: center top;"' : '';
    card.innerHTML = `
      <div class="work-image">
        <img src="${work.img}" alt="${work.title}" loading="lazy" ${imgStyle}>
        <div class="work-overlay">
          <a href="${work.link}" class="work-link">詳細を見る</a>
        </div>
      </div>
      <div class="work-content">
        <h3 class="work-title">${work.title}</h3>
        <p class="work-description">${work.desc}</p>
      </div>
    `;
    sliderGrid.appendChild(card);
  });
}

// ページごとにOther Worksを自動生成
const pageName = location.pathname.split('/').pop();
if (document.querySelector('.related-works-grid')) {
  renderOtherWorksSlider(pageName);
}

// ===== Other Works 自動スライダー（PC3枚/SP1枚ピッタリ対応） =====
(function() {
  const grid = document.querySelector('.related-works-grid');
  if (!grid) return;
  let current = 0;
  let intervalId = null;

  function getVisible() {
    return window.innerWidth <= 600 ? 1 : 3;
  }
  function getGap() {
    const style = window.getComputedStyle(grid);
    return parseInt(style.gap) || 0;
  }
  function getCards() {
    return grid.querySelectorAll('.work-card');
  }
  function slideTo(idx) {
    const cards = getCards();
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + getGap();
    grid.style.transform = `translateX(${-cardWidth * idx}px)`;
  }
  function autoSlide() {
    const cards = getCards();
    const visible = getVisible();
    if (cards.length <= visible) return;
    current = (current + 1) % (cards.length - visible + 1);
    slideTo(current);
  }
  function startSlider() {
    if (intervalId) clearInterval(intervalId);
    current = 0;
    slideTo(current);
    intervalId = setInterval(autoSlide, 3000);
  }
  window.addEventListener('resize', startSlider);
  startSlider();
})();

// ===== アートカーソル追従 =====
function setupArtCursor() {
  // 既存のart-cursorをすべて削除
  document.querySelectorAll('#art-cursor').forEach(el => el.remove());
  // 新規生成
  const artCursor = document.createElement('div');
  artCursor.id = 'art-cursor';
  document.body.appendChild(artCursor);
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    artCursor.style.transform = `translate3d(${cursorX - 22}px, ${cursorY - 22}px, 0)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}
setupArtCursor();

// ===== 共通パーツ（フッター）自動挿入 =====
function includeCommonParts() {
    return fetch('footer.html')
        .then(res => res.text())
        .then(html => {
            const footer = document.querySelector('footer.footer');
            if (footer) {
                footer.outerHTML = html;
            } else {
                document.body.insertAdjacentHTML('beforeend', html);
            }
        });
}

// 共通パーツ挿入後に初期化処理を再実行
includeCommonParts().then(() => {
    // ===== 既存の初期化処理（必要に応じて再実行） =====
    // ここに必要な初期化処理を追加
    setupArtCursor(); // フッター挿入後にも再実行
});

// ===== ユーティリティ関数 =====

// スムーズスクロール関数
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// デバウンス関数
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// パララックスヒーロー効果の実装
class ParallaxHero {
    constructor() {
        this.scrollProgress = 0;
        this.mediaFullyExpanded = false;
        this.showContent = false;
        this.touchStartY = 0;
        this.isMobile = window.innerWidth < 768;
        this.isNavigating = false;
        
        this.elements = {
            bgImage: document.getElementById('bgImage'),
            bgOverlay: document.getElementById('bgOverlay'),
            mediaContainer: document.getElementById('mediaContainer'),
            heroVideo: document.getElementById('heroVideo'),
            mediaOverlay: document.getElementById('mediaOverlay'),
            titleLeft: document.getElementById('titleLeft'),
            titleRight: document.getElementById('titleRight'),
            subtitleLeft: document.getElementById('subtitleLeft'),
            subtitleRight: document.getElementById('subtitleRight'),
            contentSection: document.getElementById('contentSection')
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateElements();
    }
    
    bindEvents() {
        // ホイールイベント
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // タッチイベント
        window.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        window.addEventListener('touchend', () => this.handleTouchEnd());
        
        // スクロールイベント
        window.addEventListener('scroll', () => this.handleScroll());
        
        // リサイズイベント
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    }
    
    handleWheel(e) {
        if (this.mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
            this.mediaFullyExpanded = false;
            e.preventDefault();
        } else if (!this.mediaFullyExpanded) {
            e.preventDefault();
            const scrollDelta = e.deltaY * 0.0009;
            this.updateProgress(scrollDelta);
        }
    }
    
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleTouchMove(e) {
        if (!this.touchStartY) return;
        
        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;
        
        if (this.mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
            this.mediaFullyExpanded = false;
            e.preventDefault();
        } else if (!this.mediaFullyExpanded) {
            e.preventDefault();
            const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
            const scrollDelta = deltaY * scrollFactor;
            this.updateProgress(scrollDelta);
            this.touchStartY = touchY;
        }
    }
    
    handleTouchEnd() {
        this.touchStartY = 0;
    }
    
    handleScroll() {
        // ナビゲーション中またはページの下部にいる場合は処理をスキップ
        if (this.isNavigating || window.scrollY > window.innerHeight) {
            return;
        }
        
        if (!this.mediaFullyExpanded) {
            window.scrollTo(0, 0);
        }
    }
    
    updateProgress(delta) {
        const newProgress = Math.min(Math.max(this.scrollProgress + delta, 0), 1);
        this.scrollProgress = newProgress;
        
        if (newProgress >= 1) {
            this.mediaFullyExpanded = true;
            this.showContent = true;
        } else if (newProgress < 0.75) {
            this.showContent = false;
        }
        
        this.updateElements();
    }
    
    updateElements() {
        const progress = this.scrollProgress;
        const isMobile = this.isMobile;
        
        // メディアコンテナのサイズ変更
        const mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
        const mediaHeight = 400 + progress * (isMobile ? 200 : 400);
        
        if (this.elements.mediaContainer) {
            this.elements.mediaContainer.style.width = `${Math.min(mediaWidth, window.innerWidth * 0.95)}px`;
            this.elements.mediaContainer.style.height = `${Math.min(mediaHeight, window.innerHeight * 0.85)}px`;
        }
        
        // 背景画像のフェード
        if (this.elements.bgOverlay) {
            this.elements.bgOverlay.style.opacity = progress;
        }
        
        // メディアオーバーレイのフェード
        if (this.elements.mediaOverlay) {
            this.elements.mediaOverlay.style.opacity = 0.4 - progress * 0.4;
        }
        
        // テキストの移動
        const textTranslateX = progress * (isMobile ? 180 : 150);
        
        if (this.elements.titleLeft) {
            this.elements.titleLeft.style.transform = `translateX(-${textTranslateX}vw)`;
        }
        
        if (this.elements.titleRight) {
            this.elements.titleRight.style.transform = `translateX(${textTranslateX}vw)`;
        }
        
        if (this.elements.subtitleLeft) {
            this.elements.subtitleLeft.style.transform = `translateX(-${textTranslateX}vw)`;
        }
        
        if (this.elements.subtitleRight) {
            this.elements.subtitleRight.style.transform = `translateX(${textTranslateX}vw)`;
        }
        
        // コンテンツの表示
        if (this.elements.contentSection) {
            if (this.showContent) {
                this.elements.contentSection.classList.add('visible');
            } else {
                this.elements.contentSection.classList.remove('visible');
            }
        }
    }
}

// DOMが読み込まれたらパララックスヒーローを初期化
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.parallax-hero-section')) {
        window.parallaxHeroInstance = new ParallaxHero();
    }
    
    // スムーズスクロール機能
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // パララックス効果のナビゲーション状態を設定
            const parallaxHero = window.parallaxHeroInstance;
            if (parallaxHero) {
                parallaxHero.isNavigating = true;
                parallaxHero.mediaFullyExpanded = true;
                parallaxHero.showContent = true;
                parallaxHero.updateElements();
            }
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // ナビゲーション完了後にフラグをリセット
            setTimeout(() => {
                if (parallaxHero) {
                    parallaxHero.isNavigating = false;
                }
            }, 1000);
        }
    }
    
    // ハッシュリンクの処理
    function handleHashLinks() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            setTimeout(() => {
                smoothScrollTo(hash);
            }, 100);
        }
    }
    
    // ページロード時のハッシュ処理
    handleHashLinks();
    
    // ハッシュ変更時の処理
    window.addEventListener('hashchange', handleHashLinks);
    
    // ナビゲーションリンクのクリック処理
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="#"]');
        if (link) {
            const href = link.getAttribute('href');
            const hashIndex = href.indexOf('#');
            if (hashIndex !== -1) {
                const hash = href.substring(hashIndex + 1);
                const targetElement = document.getElementById(hash);
                if (targetElement && (window.location.pathname === '/index.html' || window.location.pathname === '/' || href.startsWith('index.html'))) {
                    e.preventDefault();
                    smoothScrollTo(hash);
                    window.history.pushState(null, null, '#' + hash);
                }
            }
        }
    });
    
    // ===== モダンアニメーション & パララックス強化 =====
    
    // スクロール進行バー
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    initScrollProgress();

    // Intersection Observer でスクロールアニメーション（強化版）
    const modernObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const modernObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // ストラグルアニメーション用の遅延
                if (entry.target.classList.contains('stagger-item')) {
                    const parent = entry.target.parentElement;
                    const siblings = Array.from(parent.querySelectorAll('.stagger-item'));
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, modernObserverOptions);

    // アニメーション対象要素を監視
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .rotate-in, .stagger-item, .blur-in, .slide-up-strong, .scroll-reveal'
    );
    animatedElements.forEach(el => modernObserver.observe(el));

    // セクションヘッダーにアニメーションクラスを追加
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        if (!header.classList.contains('fade-in-up')) {
            header.classList.add('fade-in-up');
            modernObserver.observe(header);
        }
    });

    // タイムラインアイテムにアニメーションクラスを追加
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('fade-in-left');
        item.style.transitionDelay = `${index * 0.15}s`;
        modernObserver.observe(item);
    });

    // ストラグルアニメーション用（ワークグリッドなど）
    const staggerContainers = document.querySelectorAll('.works-grid, .strengths-grid');
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.work-card, .strength-item');
        items.forEach((item) => {
            if (!item.classList.contains('stagger-item')) {
                item.classList.add('stagger-item');
                modernObserver.observe(item);
            }
        });
    });

    // ===== パララックス効果強化 =====
    
    // スクロール連動パララックス
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // パララックス要素
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach((element, index) => {
            const speed = element.dataset.speed || (0.3 + index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // パララックス背景
        const parallaxBgs = document.querySelectorAll('.parallax-section-bg');
        parallaxBgs.forEach(bg => {
            const speed = bg.dataset.speed || 0.5;
            const yPos = scrolled * speed;
            bg.style.transform = `translateY(${yPos}px)`;
        });

        // パララックス画像
        const parallaxImgs = document.querySelectorAll('.parallax-img');
        parallaxImgs.forEach(img => {
            const speed = img.dataset.speed || 0.2;
            const rect = img.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `translateY(${yPos}px) scale(1)`;
            }
        });

        // パララックスレイヤー
        const layerFront = document.querySelectorAll('.parallax-layer-front');
        const layerMid = document.querySelectorAll('.parallax-layer-mid');
        const layerBack = document.querySelectorAll('.parallax-layer-back');

        layerFront.forEach(el => {
            const yPos = scrolled * 0.1;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        layerMid.forEach(el => {
            const yPos = scrolled * 0.3;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        layerBack.forEach(el => {
            const yPos = scrolled * 0.5;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // セクション背景パララックス
        const sectionsWithParallax = document.querySelectorAll('.section-with-parallax::before');
        document.querySelectorAll('.section-with-parallax').forEach(section => {
            const rect = section.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView) {
                const offset = (rect.top - window.innerHeight / 2) * 0.1;
                section.style.setProperty('--parallax-offset', `${offset}px`);
            }
        });

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxUpdate);
    
    // 初回実行
    updateParallax();

    // ===== マウス追従パララックス =====
    let mouseX = 0;
    let mouseY = 0;
    let mouseUpdateTicking = false;

    function updateMouseParallax() {
        const mouseParallaxElements = document.querySelectorAll('.mouse-parallax');

        mouseParallaxElements.forEach((element, index) => {
            const depth = element.dataset.depth || (index + 1) * 8;
            const moveX = (mouseX - 0.5) * depth;
            const moveY = (mouseY - 0.5) * depth;
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        mouseUpdateTicking = false;
    }

    function requestMouseUpdate() {
        if (!mouseUpdateTicking) {
            window.requestAnimationFrame(updateMouseParallax);
            mouseUpdateTicking = true;
        }
    }

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        requestMouseUpdate();
    });

    // ===== ワークカード3Dティルト効果 =====
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        card.classList.add('tilt-3d');
        
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth <= 768) return; // モバイルではスキップ

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // ===== スムーズな数値カウントアップ =====
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // カウンター要素を監視
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ===== パフォーマンス最適化 =====
    
    // Reduced Motion対応
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // アニメーションを無効化
        document.querySelectorAll('[class*="animation"], [class*="parallax"]').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
        
        // スクロールイベントを解除
        window.removeEventListener('scroll', requestParallaxUpdate);
        document.removeEventListener('mousemove', requestMouseUpdate);
    }

    // デバイス検出とパフォーマンス調整
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // モバイルでは重いアニメーションを無効化
        document.querySelectorAll('.mouse-parallax, .tilt-3d').forEach(el => {
            el.style.transform = 'none';
        });
    }

    console.log('✨ モダンアニメーション & パララックス強化が有効になりました');
});

