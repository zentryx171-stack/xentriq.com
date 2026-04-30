// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    (function() {
        emailjs.init("q4vjvs5b03ZnTr9LV");
    })();

    // Initialize service selection
    initServiceSelection();
    
    // Initialize form
    initForm();
});

// ===== SERVICE SELECTION ===== */
let selectedService = '';

function initServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-option');
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store selected service
            selectedService = this.dataset.service;
            
            // Show form after a short delay
            setTimeout(() => {
                showEnrollmentForm();
            }, 300);
        });
    });
}

function showEnrollmentForm() {
    const serviceSelection = document.getElementById('serviceSelection');
    const enrollForm = document.getElementById('enrollForm');
    const selectedServiceName = document.getElementById('selectedServiceName');
    
    // Get service name
    const serviceNames = {
        'website': 'Website Development',
        'app': 'Mobile App Development',
        'ecommerce': 'E-commerce Website',
        'software': 'Custom Software',
        'ai': 'AI Solutions',
        'branding': 'Branding'
    };
    
    selectedServiceName.textContent = serviceNames[selectedService] || 'Unknown Service';
    
    // Hide service selection and show form
    serviceSelection.style.display = 'none';
    enrollForm.style.display = 'block';
    
    // Smooth scroll to form
    enrollForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function changeService() {
    const serviceSelection = document.getElementById('serviceSelection');
    const enrollForm = document.getElementById('enrollForm');
    const serviceOptions = document.querySelectorAll('.service-option');
    
    // Reset selected service
    selectedService = '';
    serviceOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Show service selection and hide form
    serviceSelection.style.display = 'block';
    enrollForm.style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== FORM HANDLING ===== */
function initForm() {
    const form = document.getElementById('clientForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm();
        });
    }
}

function submitForm() {
    const form = document.getElementById('clientForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
    const successCheck = submitBtn.querySelector('.success-check');
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add selected service to data
    data.selectedService = selectedService;
    
    // Validate required fields
    const requiredFields = [
        'fullName', 'email', 'mobile', 'businessType', 
        'projectName', 'projectDescription', 'budget', 
        'deadline', 'hasLogo', 'hasDomain', 'needHosting'
    ];
    
    let isValid = true;
    let firstErrorField = null;
    
    for (const field of requiredFields) {
        const fieldElement = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            isValid = false;
            if (fieldElement && !firstErrorField) {
                firstErrorField = fieldElement;
            }
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        isValid = false;
        if (!firstErrorField) {
            firstErrorField = document.getElementById('email');
        }
    }
    
    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.mobile) || data.mobile.length < 10) {
        isValid = false;
        if (!firstErrorField) {
            firstErrorField = document.getElementById('mobile');
        }
    }
    
    if (!isValid) {
        // Show error and focus first error field
        showNotification('Please fill in all required fields correctly.', 'error');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.style.borderColor = '#ef4444';
            setTimeout(() => {
                firstErrorField.style.borderColor = '';
            }, 3000);
        }
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.opacity = '0';
    loadingSpinner.style.display = 'block';
    
    // Prepare email data with ALL form fields - using exact field names that EmailJS expects
    const emailData = {
        // Personal Information
        name: data.fullName,
        full_name: data.fullName,
        age: data.age || 'Not provided',
        gender: data.gender || 'Not provided',
        
        // Contact Information
        email: data.email,
        mobile: data.mobile,
        whatsapp: data.whatsapp || 'Not provided',
        
        // Location Information
        city: data.city,
        state: data.state,
        country: data.country,
        address: `${data.city}, ${data.state}, ${data.country}`,
        full_address: `${data.city}, ${data.state}, ${data.country}`,
        
        // Business Information
        company: data.company || 'Not provided',
        business_type: data.businessType,
        
        // Service Selection
        service: data.selectedService,
        service_needed: data.selectedService,
        project_type: data.selectedService,
        
        // Project Details
        project_name: data.projectName,
        project_description: data.projectDescription,
        description: data.projectDescription,
        
        // Requirements
        features: data.features || 'Not specified',
        colors: data.colors || 'Not specified',
        preferred_colors: data.colors || 'Not specified',
        
        // Budget and Timeline
        budget: data.budget,
        budget_range: data.budget,
        deadline: data.deadline,
        
        // Additional Requirements
        has_logo: data.hasLogo,
        has_domain: data.hasDomain,
        need_hosting: data.needHosting,
        additional_notes: data.additionalNotes || 'None',
        
        // EmailJS required fields
        to_email: 'xentriqin@gmail.com',
        from_name: data.fullName,
        from_email: data.email,
        to_name: 'Xentriq Team',
        
        // Message summary - comprehensive email body with ALL details
        message: `
NEW INQUIRY FROM XENTRIQ WEBSITE

==========================================
PERSONAL INFORMATION
==========================================
Name: ${data.fullName}
Age: ${data.age || 'Not provided'}
Gender: ${data.gender || 'Not provided'}

==========================================
CONTACT INFORMATION
==========================================
Email: ${data.email}
Mobile: ${data.mobile}
WhatsApp: ${data.whatsapp || 'Not provided'}

==========================================
LOCATION INFORMATION
==========================================
City: ${data.city}
State: ${data.state}
Country: ${data.country}
Full Address: ${data.city}, ${data.state}, ${data.country}

==========================================
BUSINESS INFORMATION
==========================================
Company: ${data.company || 'Not provided'}
Business Type: ${data.businessType}

==========================================
SERVICE DETAILS
==========================================
Service Needed: ${data.selectedService}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

==========================================
REQUIREMENTS
==========================================
Features Needed: ${data.features || 'Not specified'}
Preferred Colors: ${data.colors || 'Not specified'}
Budget Range: ${data.budget}
Expected Deadline: ${data.deadline}

==========================================
ADDITIONAL REQUIREMENTS
==========================================
Has Logo: ${data.hasLogo}
Has Domain: ${data.hasDomain}
Need Hosting: ${data.needHosting}
Additional Notes: ${data.additionalNotes || 'None'}

==========================================
SUBMITTED ON: ${new Date().toLocaleString()}
==========================================
        `,
        subject: `New Inquiry: ${data.selectedService} - ${data.fullName} (${data.city}, ${data.country})`
    };
    
    // Debug: Log the email data before sending
    console.log('Sending email with data:', emailData);
    
    // Send email using EmailJS
    emailjs.send('service_82svxq8', 'template_qpgvn2k', emailData)
        .then(function(response) {
            console.log('Email sent successfully:', response.status, response.text);
            
            // Show success state
            loadingSpinner.style.display = 'none';
            successCheck.style.display = 'block';
            
            // After success animation, show success message
            setTimeout(() => {
                successCheck.style.display = 'none';
                btnText.textContent = 'Submitted!';
                btnText.style.opacity = '1';
                
                // Show success message
                enrollForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form after delay
                setTimeout(() => {
                    enrollForm.reset();
                    showServiceSelection();
                }, 3000);
            }, 2000);
        })
        .catch(function(error) {
            console.error('EmailJS error:', error);
            console.error('Error details:', error.text);
            
            // Show error state
            loadingSpinner.style.display = 'none';
            btnText.textContent = 'Submit Inquiry';
            btnText.style.opacity = '1';
            submitBtn.disabled = false;
            
            // Show error notification with more details
            showNotification('Failed to send inquiry: ' + (error.text || 'Unknown error'), 'error');
        });
}

function showSuccessMessage() {
    const enrollForm = document.getElementById('enrollForm');
    const successMessage = document.getElementById('successMessage');
    
    // Hide form and show success message
    enrollForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== NOTIFICATION SYSTEM ===== */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-size: 0.9rem;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}


// Add input validation feedback
document.addEventListener('DOMContentLoaded', function() {
    // Email validation feedback
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    // Phone validation feedback
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('blur', function() {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (this.value && (!phoneRegex.test(this.value) || this.value.length < 10)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console branding
console.log('%c Xentriq Enrollment Form ', 'background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
