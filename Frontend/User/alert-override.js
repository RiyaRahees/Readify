(function() {
    // 1. Inject Styles programmatically
    const styles = `
        /* Premium Toasts Container */
        .toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 999999;
            pointer-events: none;
            max-width: 380px;
            width: 100%;
        }

        /* Premium Toast Card */
        .premium-toast {
            pointer-events: auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 16px 20px;
            box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04);
            display: flex;
            align-items: flex-start;
            gap: 14px;
            transform: translateX(120%);
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .premium-toast.show {
            transform: translateX(0);
            opacity: 1;
        }

        /* Toast Types Accent Lines */
        .premium-toast::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 4px;
        }

        .toast-success::before { background-color: #10B981; }
        .toast-error::before { background-color: #EF4444; }
        .toast-warning::before { background-color: #F59E0B; }
        .toast-info::before { background-color: #3B82F6; }

        .toast-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .toast-success .toast-icon-wrapper { background-color: #ECFDF5; color: #10B981; }
        .toast-error .toast-icon-wrapper { background-color: #FEF2F2; color: #EF4444; }
        .toast-warning .toast-icon-wrapper { background-color: #FEF3C7; color: #F59E0B; }
        .toast-info .toast-icon-wrapper { background-color: #EFF6FF; color: #3B82F6; }

        .toast-content-wrapper {
            flex: 1;
        }

        .toast-title {
            font-size: 14px;
            font-weight: 700;
            color: #0F172A;
            margin: 0 0 2px 0;
            line-height: 1.2;
        }

        .toast-message {
            font-size: 13px;
            color: #64748B;
            margin: 0;
            line-height: 1.4;
        }

        .toast-close-btn {
            background: none;
            border: none;
            color: #94A3B8;
            cursor: pointer;
            padding: 2px;
            display: flex;
            transition: color 0.2s;
        }

        .toast-close-btn:hover {
            color: #475569;
        }

        /* Toast Progress Indicator */
        .toast-progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background-color: rgba(226, 232, 240, 0.5);
        }

        .toast-progress-fill {
            height: 100%;
            width: 100%;
            transform-origin: left;
            animation: shrinkProgress linear forwards;
        }

        .toast-success .toast-progress-fill { background-color: #10B981; }
        .toast-error .toast-progress-fill { background-color: #EF4444; }
        .toast-warning .toast-progress-fill { background-color: #F59E0B; }
        .toast-info .toast-progress-fill { background-color: #3B82F6; }

        @keyframes shrinkProgress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }

        /* Dialog overlays */
        .custom-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            font-family: 'Inter', sans-serif;
            padding: 20px;
        }
        
        .custom-popup-overlay.show {
            opacity: 1;
            pointer-events: auto;
        }

        .custom-popup-card {
            background: #ffffff;
            border-radius: 28px;
            padding: 32px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.05);
            text-align: center;
            transform: scale(0.92) translateY(12px);
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .custom-popup-overlay.show .custom-popup-card {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        .custom-popup-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(79, 70, 229, 0.08);
            color: #4F46E5;
            margin-bottom: 20px;
            font-size: 24px;
        }
        
        .custom-popup-icon.confirm-danger {
            background: rgba(239, 68, 68, 0.08);
            color: #EF4444;
        }

        .custom-popup-title {
            font-size: 20px;
            font-weight: 800;
            color: #0F172A;
            margin-bottom: 10px;
        }

        .custom-popup-message {
            font-size: 14.5px;
            color: #64748B;
            line-height: 1.6;
            margin-bottom: 28px;
        }

        .custom-popup-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .custom-popup-btn {
            padding: 13px 24px;
            border-radius: 12px;
            font-size: 14.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .custom-popup-btn-primary {
            background: linear-gradient(135deg, #4F46E5 0%, #7B61FF 100%);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .custom-popup-btn-primary:hover {
            transform: translateY(-1.5px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
        }
        
        .custom-popup-btn-danger {
            background: #EF4444;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .custom-popup-btn-danger:hover {
            background: #DC2626;
            transform: translateY(-1.5px);
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
        }

        .custom-popup-btn-secondary {
            background: #F1F5F9;
            color: #475569;
            border: 1px solid #E2E8F0;
        }

        .custom-popup-btn-secondary:hover {
            background: #E2E8F0;
            transform: translateY(-1.5px);
        }

        /* Blocking loading overlay */
        .loading-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .loading-overlay.show {
            opacity: 1;
            pointer-events: auto;
        }

        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #4F46E5;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        .loading-text {
            color: #FFFFFF;
            font-size: 15px;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Initialize Toast Container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // 2. Global Toast Function
    window.showToast = function(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `premium-toast toast-${type}`;

        let icon = '✔';
        if (type === 'error') icon = '✕';
        if (type === 'warning') icon = '⚠';
        if (type === 'info') icon = 'ℹ';

        toast.innerHTML = `
            <div class="toast-icon-wrapper">
                <span>${icon}</span>
            </div>
            <div class="toast-content-wrapper">
                <h5 class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</h5>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close-btn" aria-label="Close text">✕</button>
            <div class="toast-progress-bar">
                <div class="toast-progress-fill" style="animation-duration: ${duration}ms"></div>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Slide in
        setTimeout(() => toast.classList.add('show'), 50);

        // Auto remove
        const autoRemoveTimeout = setTimeout(() => {
            closeToast();
        }, duration);

        function closeToast() {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }

        toast.querySelector('.toast-close-btn').onclick = () => {
            clearTimeout(autoRemoveTimeout);
            closeToast();
        };
    };

    // 3. Alert Global Override Function (Uses toasts)
    window.alert = function(message) {
        const lowerMsg = message.toLowerCase();
        let type = 'info';
        
        if (lowerMsg.includes('success') || lowerMsg.includes('complete') || lowerMsg.includes('applied') || lowerMsg.includes('sent') || lowerMsg.includes('thank you')) {
            type = 'success';
        } else if (lowerMsg.includes('failed') || lowerMsg.includes('error') || lowerMsg.includes('wrong') || lowerMsg.includes('denied') || lowerMsg.includes('invalid') || lowerMsg.includes('cannot connect')) {
            type = 'error';
        } else if (lowerMsg.includes('warning') || lowerMsg.includes('attention') || lowerMsg.includes('stock')) {
            type = 'warning';
        }
        
        window.showToast(message, type, 3500);
    };

    // 4. Confirm Modal Helper (returns Promise<boolean>)
    window.showConfirm = function(message, isDanger = false, customTitle = '') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'custom-popup-overlay';
            
            const iconHtml = isDanger ? '🗑' : '❓';
            const iconClass = isDanger ? 'confirm-danger' : '';
            const titleText = customTitle || (isDanger ? 'Are you sure?' : 'Confirmation');
            const primaryBtnClass = isDanger ? 'custom-popup-btn-danger' : 'custom-popup-btn-primary';
            const confirmText = isDanger ? 'Delete' : 'Confirm';

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

    // 5. Loading Indicator Helper
    let loadingEl = null;
    window.showLoading = function(message = 'Processing request...') {
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.className = 'loading-overlay';
            loadingEl.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            `;
            document.body.appendChild(loadingEl);
        } else {
            loadingEl.querySelector('.loading-text').innerText = message;
        }
        setTimeout(() => loadingEl.classList.add('show'), 10);
    };

    window.hideLoading = function() {
        if (loadingEl) {
            loadingEl.classList.remove('show');
            setTimeout(() => {
                if (loadingEl) {
                    loadingEl.remove();
                    loadingEl = null;
                }
            }, 300);
        }
    };

    // 6. Global Form Inline Validation Helper
    window.setupFormValidation = function(formId, validationConfig) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Prevent standard HTML5 tooltips if custom ones exist
        form.setAttribute('novalidate', 'true');

        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const name = input.id || input.name;
            if (!validationConfig[name]) return;

            // Blur validation
            input.addEventListener('blur', () => {
                validateInput(input, validationConfig[name]);
            });

            // Input typing validation clears error
            input.addEventListener('input', () => {
                clearInputError(input);
            });
        });

        form.addEventListener('submit', (e) => {
            let isValid = true;
            inputs.forEach(input => {
                const name = input.id || input.name;
                if (validationConfig[name]) {
                    const result = validateInput(input, validationConfig[name]);
                    if (!result) isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                e.stopPropagation();
                window.showToast("Please correct the validation errors in the form.", "error");
            }
        });
    };

    function validateInput(input, rules) {
        clearInputError(input);
        const value = input.value.trim();

        if (rules.required && !value) {
            showInputError(input, rules.requiredMessage || "This field is required.");
            return false;
        }

        if (value) {
            if (rules.pattern && !rules.pattern.test(value)) {
                showInputError(input, rules.patternMessage || "Invalid format.");
                return false;
            }
            if (rules.minLength && value.length < rules.minLength) {
                showInputError(input, rules.minLengthMessage || `Minimum length is ${rules.minLength} characters.`);
                return false;
            }
            if (rules.matchField) {
                const matchInput = document.getElementById(rules.matchField);
                if (matchInput && matchInput.value.trim() !== value) {
                    showInputError(input, rules.matchMessage || "Fields do not match.");
                    return false;
                }
            }
            if (rules.customValidate) {
                const customResult = rules.customValidate(value);
                if (customResult !== true) {
                    showInputError(input, customResult || "Invalid value.");
                    return false;
                }
            }
        }

        input.classList.add('is-valid');
        return true;
    }

    function showInputError(input, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        // Find or create feedback text
        let feedback = input.parentNode.querySelector('.invalid-feedback-text');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback-text';
            input.parentNode.appendChild(feedback);
        }
        feedback.innerHTML = `<span>⚠️</span> ${message}`;
    }

    function clearInputError(input) {
        input.classList.remove('is-invalid');
        const feedback = input.parentNode.querySelector('.invalid-feedback-text');
        if (feedback) feedback.remove();
    }

    // Expose helpers globally
    window.validateInput = validateInput;
    window.clearInputError = clearInputError;
    window.showInputError = showInputError;

})();
