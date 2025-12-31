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

// ===== アートカーソル追従（Worksより下のセクションで表示） =====
function setupArtCursor() {
  // 既存のart-cursorをすべて削除
  document.querySelectorAll('#art-cursor').forEach(el => el.remove());
  
  // 新規生成
  const artCursor = document.createElement('div');
  artCursor.id = 'art-cursor';
  document.body.appendChild(artCursor);
  
  // 初期状態は非表示
  artCursor.style.opacity = '0';
  artCursor.style.transform = 'scale(0)';
  artCursor.style.pointerEvents = 'none';
  
  // マウス位置
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  
  // 表示状態
  let isVisible = false;
  let rafId = null;
  
  // Worksセクションと見出しを取得
  const worksSection = document.querySelector('.works-section');
  const worksHeader = worksSection ? worksSection.querySelector('.section-header') : null;
  
  // セクションが表示範囲内かチェック
  function isSectionInView(section) {
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }
  
  // マウスがWorks見出しより下にあるかチェック
  function isMouseInTargetSections(x, y) {
    if (!worksHeader) return false;
    
    const headerRect = worksHeader.getBoundingClientRect();
    // Works見出しのbottomより下（見出しから下のエリア）
    return y > headerRect.bottom;
  }
  
  // カーソルを表示
  function showCursor() {
    if (isVisible) return;
    isVisible = true;
    artCursor.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    artCursor.style.opacity = '1';
    artCursor.style.transform = 'scale(1)';
  }
  
  // カーソルを非表示
  function hideCursor() {
    if (!isVisible) return;
    isVisible = false;
    artCursor.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    artCursor.style.opacity = '0';
    artCursor.style.transform = 'scale(0)';
  }
  
  // マウス移動イベント（throttle適用）
  let lastMoveTime = 0;
  const throttleDelay = 16; // 約60fps
  
  function handleMouseMove(e) {
    const now = Date.now();
    if (now - lastMoveTime < throttleDelay) return;
    lastMoveTime = now;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Worksセクションより下でマウスが動いているかチェック
    if (isMouseInTargetSections(mouseX, mouseY)) {
      showCursor();
    } else {
      hideCursor();
    }
  }
  
  // スクロールイベント（throttle適用）
  let lastScrollTime = 0;
  function handleScroll() {
    const now = Date.now();
    if (now - lastScrollTime < throttleDelay) return;
    lastScrollTime = now;
    
    // Works見出しより下のエリアが表示範囲内にあるかチェック
    if (worksHeader) {
      const headerRect = worksHeader.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const headerBottom = headerRect.bottom + scrollY;
      const currentScroll = scrollY + window.innerHeight / 2;
      
      // Works見出しより下にスクロールしている場合
      if (currentScroll > headerBottom - 200) {
        // マウス位置も確認
        if (isMouseInTargetSections(mouseX, mouseY)) {
          showCursor();
        }
      } else {
        hideCursor();
      }
    }
  }
  
  // イベントリスナー登録
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // リサイズ時の処理
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // リサイズ後、現在の状態を再チェック
      if (isMouseInTargetSections(mouseX, mouseY)) {
        showCursor();
      } else {
        hideCursor();
      }
    }, 100);
  }, { passive: true });
  
  // アニメーションループ
  function animateCursor() {
    if (isVisible) {
      // スムーズな追従
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      artCursor.style.transform = `translate3d(${cursorX - 22}px, ${cursorY - 22}px, 0) scale(1)`;
    }
    rafId = requestAnimationFrame(animateCursor);
  }
  
  // アニメーション開始
  animateCursor();
  
  // 初期チェック
  setTimeout(() => {
    if (isMouseInTargetSections(mouseX, mouseY)) {
      showCursor();
    }
  }, 100);
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
    

    // ===== タイムラインのスクロール連動アニメーション =====
    function initTimelineScroll() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        const timelineItems = document.querySelectorAll('.timeline-item');
        
        function updateTimelineProgress() {
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // タイムラインが画面内に入ってから計算開始
            const startOffset = windowHeight * 0.6; // 画面の60%の位置で開始
            const timelineTop = rect.top;
            const timelineHeight = rect.height;
            
            // 進行率を計算 (0% 〜 100%)
            let progress = (startOffset - timelineTop);
            
            // 範囲制限
            if (progress < 0) progress = 0;
            if (progress > timelineHeight) progress = timelineHeight;
            
            // 進行バーの高さを更新
            timeline.style.setProperty('--line-height', `${progress}px`);
            
            // CSS変数を使って疑似要素の高さを制御するためにstyleタグを追加または更新
            let styleEl = document.getElementById('timeline-dynamic-style');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'timeline-dynamic-style';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = `.timeline::after { height: ${progress}px !important; }`;

            // 各アイテムのアクティブ状態を更新
            timelineItems.forEach(item => {
                const itemTop = item.getBoundingClientRect().top - timeline.getBoundingClientRect().top;
                
                // 線がアイテムの位置を超えたらアクティブ
                if (progress >= itemTop) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateTimelineProgress);
        }, { passive: true });
        
        // 初回実行
        updateTimelineProgress();
    }

    initTimelineScroll();

});

