(function() {
    // 1. Inject Styles programmatically
    const styles = `
        /* Custom Modern Modal Overlay */
        .custom-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .custom-popup-overlay.show {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal Card styling */
        .custom-popup-card {
            background: #ffffff;
            border-radius: 24px;
            padding: 32px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
            text-align: center;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .custom-popup-overlay.show .custom-popup-card {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        /* Title / Message styling */
        .custom-popup-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(91, 75, 255, 0.08);
            color: #5B4BFF;
            margin-bottom: 20px;
            font-size: 24px;
        }
        
        .custom-popup-icon.confirm-danger {
            background: rgba(239, 68, 68, 0.08);
            color: #ef4444;
        }

        .custom-popup-title {
            font-size: 18px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 8px;
        }

        .custom-popup-message {
            font-size: 14.5px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 28px;
        }

        /* Buttons Container */
        .custom-popup-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .custom-popup-btn {
            padding: 12px 24px;
            border-radius: 100px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            flex: 1;
        }

        .custom-popup-btn-primary {
            background: #5B4BFF;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(91, 75, 255, 0.25);
        }

        .custom-popup-btn-primary:hover {
            background: #4737E5;
            transform: translateY(-1.5px);
            box-shadow: 0 6px 14px rgba(91, 75, 255, 0.35);
        }
        
        .custom-popup-btn-danger {
            background: #ef4444;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.25);
        }

        .custom-popup-btn-danger:hover {
            background: #dc2626;
            transform: translateY(-1.5px);
            box-shadow: 0 6px 14px rgba(239, 68, 68, 0.35);
        }

        .custom-popup-btn-secondary {
            background: #f1f5f9;
            color: #64748b;
            border: 1px solid #cbd5e1;
        }

        .custom-popup-btn-secondary:hover {
            background: #e2e8f0;
            color: #334155;
            transform: translateY(-1.5px);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // 2. Alert Global Override Function
    window.alert = function(message) {
        // Create popup elements
        const overlay = document.createElement('div');
        overlay.className = 'custom-popup-overlay';
        
        // Try to customize icon based on text matching
        let iconHtml = '📢';
        let titleText = 'Alert';
        
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('success') || lowerMsg.includes('complete') || lowerMsg.includes('applied') || lowerMsg.includes('sent')) {
            iconHtml = '🎉';
            titleText = 'Success';
        } else if (lowerMsg.includes('failed') || lowerMsg.includes('error') || lowerMsg.includes('wrong') || lowerMsg.includes('denied') || lowerMsg.includes('invalid') || lowerMsg.includes('cannot connect')) {
            iconHtml = '⚠️';
            titleText = 'Oops!';
        } else if (lowerMsg.includes('wishlist')) {
            iconHtml = '💖';
            titleText = 'Wishlist';
        } else if (lowerMsg.includes('cart') || lowerMsg.includes('stock')) {
            iconHtml = '🛒';
            titleText = 'Shopping Cart';
        }

        overlay.innerHTML = `
            <div class="custom-popup-card">
                <div class="custom-popup-icon">${iconHtml}</div>
                <h4 class="custom-popup-title">${titleText}</h4>
                <p class="custom-popup-message">${message}</p>
                <div class="custom-popup-buttons">
                    <button class="custom-popup-btn custom-popup-btn-primary" id="customPopupOkBtn">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Animate in
        setTimeout(() => overlay.classList.add('show'), 10);

        // Click handler to resolve/remove
        const okBtn = overlay.querySelector('#customPopupOkBtn');
        okBtn.focus();
        
        const closePopup = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 250);
        };

        okBtn.onclick = closePopup;
        overlay.onclick = function(e) {
            if (e.target === overlay) {
                closePopup();
            }
        };
    };

    // 3. Confirm Modal Helper (returns Promise<boolean>)
    window.showConfirm = function(message, isDanger = false) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'custom-popup-overlay';
            
            const iconHtml = isDanger ? '🗑️' : '❓';
            const iconClass = isDanger ? 'confirm-danger' : '';
            const titleText = isDanger ? 'Are you sure?' : 'Confirmation';
            const primaryBtnClass = isDanger ? 'custom-popup-btn-danger' : 'custom-popup-btn-primary';
            const confirmText = isDanger ? 'Confirm' : 'Yes, Confirm';

            overlay.innerHTML = `
                <div class="custom-popup-card">
                    <div class="custom-popup-icon ${iconClass}">${iconHtml}</div>
                    <h4 class="custom-popup-title">${titleText}</h4>
                    <p class="custom-popup-message">${message}</p>
                    <div class="custom-popup-buttons">
                        <button class="custom-popup-btn custom-popup-btn-secondary" id="customPopupCancelBtn">Cancel</button>
                        <button class="custom-popup-btn ${primaryBtnClass}" id="customPopupConfirmBtn">${confirmText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // Animate in
            setTimeout(() => overlay.classList.add('show'), 10);

            const cancelBtn = overlay.querySelector('#customPopupCancelBtn');
            const confirmBtn = overlay.querySelector('#customPopupConfirmBtn');
            confirmBtn.focus();

            const close = (result) => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                    resolve(result);
                }, 250);
            };

            cancelBtn.onclick = () => close(false);
            confirmBtn.onclick = () => close(true);
            overlay.onclick = function(e) {
                if (e.target === overlay) {
                    close(false);
                }
            };
        });
    };
})();
