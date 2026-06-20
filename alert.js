/**
 * ONVSHARK ALERT
 * Author  : Refael Sinaga 2026 | refaelsinaga.com
 * Version : 1.0.0
 *
 * onvsAlert(icon, type, title, message, buttons)
 *
 * @param {boolean}     icon     - true = tampilkan icon, false = tanpa icon
 * @param {string}      type     - 'success' | 'danger' | 'warning' | 'info'
 * @param {string}      title    - judul alert
 * @param {string|null} message  - pesan di bawah judul (boleh null)
 * @param {object}      buttons  - konfigurasi tombol (lihat contoh di bawah)
 *
 * buttons = {
 *   confirm: {
 *     label   : 'Delete',          // teks tombol
 *     color   : '#fd625e',         // warna background (opsional, default ikut type)
 *     icon    : 'trash',           // 'trash' | 'check' | 'x' | null
 *     onClick : () => {}           // callback saat diklik (opsional)
 *   },
 *   cancel: {                      // opsional — tidak ada = close only
 *     label   : 'Cancel',
 *     icon    : 'x',
 *     onClick : () => {}           // callback saat diklik (opsional)
 *   }
 * }
 */
(function (window) {
    'use strict';

    /* ── warna default per type ── */
    const TYPE_COLOR = {
        success : '#2ab57d',
        danger  : '#fd625e',
        warning : '#ffbf53',
        info    : '#4ba6ef',
    };

    /* ── SVG icons inline ── */
    const ICONS_TYPE = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="9 12 11.5 14.5 15.5 9.5"/>
                  </svg>`,
        danger:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>`,
        info:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>`,
    };

    const ICONS_BTN = {
        trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>`,
        x:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>`,
        ok:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>`,
    };

    const X_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                     <line x1="18" y1="6" x2="6" y2="18"/>
                     <line x1="6" y1="6" x2="18" y2="18"/>
                   </svg>`;

    function escape(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function close(overlay) {
        overlay.classList.add('onvs-alert-closing');
        setTimeout(() => overlay.parentNode && overlay.parentNode.removeChild(overlay), 210);
    }

    function onvsAlert(icon, type, title, message, buttons) {
        const validTypes = ['success', 'danger', 'warning', 'info'];
        const t       = validTypes.includes(type) ? type : 'info';
        const useIcon = icon !== false;
        const btn     = buttons || {};
        const confirm = btn.confirm || null;
        const cancel  = btn.cancel  || null;
        const color   = (confirm && confirm.color) ? confirm.color : TYPE_COLOR[t];

        /* ── overlay ── */
        const overlay = document.createElement('div');
        overlay.className = 'onvs-alert-overlay';

        /* ── box ── */
        const box = document.createElement('div');
        box.className = `onvs-alert-box onvs-alert-${t}${useIcon ? '' : ' onvs-alert-no-icon'}`;

        /* ── tombol X pojok ── */
        const xBtn = document.createElement('button');
        xBtn.className = 'onvs-alert-x';
        xBtn.title = 'Tutup';
        xBtn.innerHTML = X_SVG;
        xBtn.addEventListener('click', () => close(overlay));

        /* ── icon type ── */
        const iconHtml = useIcon
            ? `<div class="onvs-alert-icon-wrap">${ICONS_TYPE[t]}</div>`
            : '';

        /* ── pesan ── */
        const msgHtml = (message && message !== '')
            ? `<div class="onvs-alert-message">${escape(message)}</div>`
            : '<div class="onvs-alert-message"></div>';

        /* ── buttons ── */
        let buttonsHtml = '<div class="onvs-alert-buttons">';

        if (cancel) {
            const cancelIcon = cancel.icon && ICONS_BTN[cancel.icon]
                ? ICONS_BTN[cancel.icon] : ICONS_BTN['x'];
            buttonsHtml += `
                <button class="onvs-alert-btn onvs-alert-btn-cancel" id="onvs-alert-cancel">
                    ${cancelIcon}${escape(cancel.label || 'Cancel')}
                </button>`;
        }

        if (confirm) {
            const confirmIcon = confirm.icon && ICONS_BTN[confirm.icon]
                ? ICONS_BTN[confirm.icon] : '';
            buttonsHtml += `
                <button class="onvs-alert-btn onvs-alert-btn-confirm" id="onvs-alert-confirm"
                    style="background:${color};">
                    ${confirmIcon}${escape(confirm.label || 'OK')}
                </button>`;
        } else {
            /* close only — tidak ada confirm & cancel */
            buttonsHtml += `
                <button class="onvs-alert-btn onvs-alert-btn-confirm" id="onvs-alert-confirm"
                    style="background:${color};">
                    ${ICONS_BTN['check']}OK
                </button>`;
        }

        buttonsHtml += '</div>';

        box.innerHTML = iconHtml
            + `<div class="onvs-alert-title">${escape(title || '')}</div>`
            + msgHtml
            + buttonsHtml;

        box.prepend(xBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        /* ── event buttons ── */
        const confirmBtn = overlay.querySelector('#onvs-alert-confirm');
        const cancelBtn  = overlay.querySelector('#onvs-alert-cancel');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (confirm && typeof confirm.onClick === 'function') confirm.onClick();
                close(overlay);
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (cancel && typeof cancel.onClick === 'function') cancel.onClick();
                close(overlay);
            });
        }

        /* klik overlay luar = tutup */
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close(overlay);
        });

        return overlay;
    }

    window.onvsAlert = onvsAlert;

})(window);
