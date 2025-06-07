// Real-time Prompt Generator - Enhanced Landing Page JavaScript

// Prompt templates database
const promptTemplates = {
    linkedin: {
        base: "Create a compelling LinkedIn post about {topic} for {audience} in the {industry} industry. The tone should be {tone} and the primary goal is to {goal}.",
        advanced: "You are a LinkedIn content strategist. Write a high-engagement LinkedIn post about {topic} specifically targeting {audience} in the {industry} sector. Use a {tone} tone and focus on {goal}. Include relevant hashtags, a compelling hook, and a clear call-to-action. Structure: Hook (first line) + Value/Story (middle) + CTA (end)."
    },
    youtube: {
        base: "Create a YouTube video outline about {topic} for {audience} in {industry}. Use a {tone} approach to {goal}.",
        advanced: "As a YouTube content creator, develop a detailed video script outline for '{topic}' targeting {audience} in the {industry} space. Maintain a {tone} tone throughout while focusing on {goal}. Include: Compelling title, hook (first 15 seconds), main content points, engagement moments, and strong CTA."
    },
    email: {
        base: "Write an email campaign about {topic} for {audience} in {industry} with a {tone} tone to {goal}.",
        advanced: "You're an email marketing expert. Create a high-converting email campaign about '{topic}' for {audience} in the {industry} industry. Use a {tone} voice and optimize for {goal}. Include: Subject line, preview text, personalized opening, value proposition, social proof, and compelling CTA."
    },
    business: {
        base: "Generate business ideas related to {topic} for {audience} in {industry} using a {tone} approach to {goal}.",
        advanced: "Act as a business consultant. Generate innovative business ideas around '{topic}' specifically for {audience} in the {industry} market. Present ideas with a {tone} approach focused on {goal}. For each idea, include: Market opportunity, target customer, revenue model, and competitive advantage."
    },
    blog: {
        base: "Create a blog post outline about {topic} for {audience} in {industry} with {tone} tone to {goal}.",
        advanced: "You're an SEO content strategist. Create a comprehensive blog post about '{topic}' targeting {audience} in the {industry} niche. Use a {tone} writing style optimized for {goal}. Include: SEO title, meta description, H2/H3 structure, key points, internal linking opportunities, and conversion elements."
    },
    social: {
        base: "Develop a social media strategy for {topic} targeting {audience} in {industry} with {tone} content to {goal}.",
        advanced: "As a social media strategist, create a comprehensive social media strategy for '{topic}' targeting {audience} in the {industry} sector. Maintain a {tone} brand voice while focusing on {goal}. Include: Platform-specific content, posting schedule, hashtag strategy, engagement tactics, and performance metrics."
    },
    product: {
        base: "Write product descriptions for {topic} targeting {audience} in {industry} using {tone} language to {goal}.",
        advanced: "You're a conversion copywriter. Create compelling product descriptions for '{topic}' targeting {audience} in the {industry} market. Use {tone} language optimized for {goal}. Include: Benefit-focused headlines, feature-to-benefit translations, social proof elements, urgency/scarcity, and persuasive CTAs."
    },
    persona: {
        base: "Create customer personas for {audience} in {industry} interested in {topic} with {tone} communication to {goal}.",
        advanced: "Act as a market researcher. Develop detailed customer personas for {audience} in the {industry} industry interested in '{topic}'. Use {tone} communication style focused on {goal}. Include: Demographics, psychographics, pain points, goals, preferred channels, buying behavior, and messaging preferences."
    },
    calendar: {
        base: "Plan a content calendar around {topic} for {audience} in {industry} using {tone} content to {goal}.",
        advanced: "You're a content marketing manager. Create a strategic content calendar around '{topic}' for {audience} in the {industry} space. Maintain a {tone} brand voice while optimizing for {goal}. Include: Content themes, posting frequency, platform distribution, seasonal considerations, and performance tracking."
    },
    sales: {
        base: "Write sales copy for {topic} targeting {audience} in {industry} with {tone} messaging to {goal}.",
        advanced: "As a sales copywriter, create high-converting sales copy for '{topic}' targeting {audience} in the {industry} market. Use {tone} messaging optimized for {goal}. Include: Attention-grabbing headline, problem identification, solution presentation, social proof, objection handling, and irresistible offer."
    }
};

// User's saved prompts
let savedPrompts = JSON.parse(localStorage.getItem('savedPrompts')) || [];
let currentPrompt = '';
let isPremiumUser = false;

// Smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Handle purchase button click
function handlePurchase() {
    const gumroadUrl = 'https://gumroad.com/l/premium-prompt-generator';
    
    trackEvent('purchase_attempt', {
        product: 'premium_pack',
        price: 5
    });
    
    window.open(gumroadUrl, '_blank');
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initNavbarScrollEffect();
    initPromptGenerator();
    initPricingHandlers();
    loadSavedPrompts();
    initAnalyticsTracking();
    
    console.log('🚀 Prompt Generator initialized successfully!');
});

// Initialize prompt generator functionality
function initPromptGenerator() {
    // Add event listeners to all controls
    const controls = ['prompt-type', 'industry', 'audience', 'tone', 'goal', 'custom-topic'];
    controls.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updatePromptPreview);
            element.addEventListener('input', updatePromptPreview);
        }
    });
    
    // Initial preview update
    updatePromptPreview();
}

// Update prompt preview in real-time
function updatePromptPreview() {
    const promptType = document.getElementById('prompt-type')?.value || 'linkedin';
    const industry = document.getElementById('industry')?.value || 'saas';
    const audience = document.getElementById('audience')?.value || 'entrepreneurs';
    const tone = document.getElementById('tone')?.value || 'professional';
    const goal = document.getElementById('goal')?.value || 'engagement';
    const customTopic = document.getElementById('custom-topic')?.value || 'productivity tips';
    
    // Get the appropriate template
    const template = promptTemplates[promptType];
    if (!template) return;
    
    // Use advanced template for premium users, basic for free
    const promptTemplate = isPremiumUser ? template.advanced : template.base;
    
    // Replace placeholders
    let generatedPrompt = promptTemplate
        .replace(/{topic}/g, customTopic || getDefaultTopic(promptType))
        .replace(/{industry}/g, formatValue(industry))
        .replace(/{audience}/g, formatValue(audience))
        .replace(/{tone}/g, formatValue(tone))
        .replace(/{goal}/g, formatValue(goal));
    
    // Update the display
    const promptDisplay = document.getElementById('prompt-display');
    if (promptDisplay) {
        promptDisplay.innerHTML = `<p>${generatedPrompt}</p>`;
        currentPrompt = generatedPrompt;
        
        // Update stats
        updatePromptStats(generatedPrompt);
        
        // Enable copy button
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.disabled = false;
        }
        
        // Show variables if premium
        if (isPremiumUser) {
            showPromptVariables(generatedPrompt);
        }
    }
}

// Generate a complete prompt
function generatePrompt() {
    updatePromptPreview();
    
    // Track generation
    trackEvent('prompt_generated', {
        type: document.getElementById('prompt-type')?.value,
        industry: document.getElementById('industry')?.value,
        is_premium: isPremiumUser
    });
    
    // Scroll to output
    document.getElementById('prompt-display')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Copy prompt to clipboard
function copyPrompt() {
    if (!currentPrompt) return;
    
    navigator.clipboard.writeText(currentPrompt).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
        trackEvent('prompt_copied', { type: document.getElementById('prompt-type')?.value });
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please select and copy manually.');
    });
}

// Save prompt to collection
function savePrompt() {
    if (!currentPrompt) return;
    
    if (!isPremiumUser) {
        showUpgradeModal('save prompts');
        return;
    }
    
    const promptData = {
        id: Date.now(),
        content: currentPrompt,
        type: document.getElementById('prompt-type')?.value,
        industry: document.getElementById('industry')?.value,
        audience: document.getElementById('audience')?.value,
        created: new Date().toISOString(),
        title: generatePromptTitle()
    };
    
    savedPrompts.unshift(promptData);
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    
    loadSavedPrompts();
    
    // Show success message
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    setTimeout(() => {
        saveBtn.textContent = originalText;
    }, 2000);
    
    trackEvent('prompt_saved', { type: promptData.type });
}

// Load and display saved prompts
function loadSavedPrompts() {
    const savedPromptsContainer = document.getElementById('saved-prompts');
    const savedPromptsList = document.getElementById('saved-prompts-list');
    
    if (!savedPromptsList) return;
    
    if (savedPrompts.length === 0) {
        savedPromptsContainer.style.display = 'none';
        return;
    }
    
    savedPromptsContainer.style.display = 'block';
    
    savedPromptsList.innerHTML = savedPrompts.map(prompt => `
        <div class="saved-prompt-item">
            <div>
                <div class="prompt-title">${prompt.title}</div>
                <div class="prompt-meta">${formatDate(prompt.created)} • ${prompt.type}</div>
            </div>
            <div class="prompt-actions">
                <button class="use-btn" onclick="usePrompt('${prompt.id}')">
                    Use
                </button>
                <button class="delete-btn" onclick="deletePrompt('${prompt.id}')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Use a saved prompt
function usePrompt(promptId) {
    const prompt = savedPrompts.find(p => p.id == promptId);
    if (!prompt) return;
    
    // Set the form values
    document.getElementById('prompt-type').value = prompt.type;
    document.getElementById('industry').value = prompt.industry;
    document.getElementById('audience').value = prompt.audience;
    
    // Update the display
    currentPrompt = prompt.content;
    document.getElementById('prompt-display').innerHTML = `<p>${prompt.content}</p>`;
    updatePromptStats(prompt.content);
    
    // Scroll to generator
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
    
    trackEvent('saved_prompt_used', { type: prompt.type });
}

// Delete a saved prompt
function deletePrompt(promptId) {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    savedPrompts = savedPrompts.filter(p => p.id != promptId);
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    loadSavedPrompts();
    
    trackEvent('prompt_deleted');
}

// Initialize pricing handlers
function initPricingHandlers() {
    // Free generator button
    const freeBtn = document.querySelector('.free-btn');
    if (freeBtn) {
        freeBtn.addEventListener('click', startFreeGenerator);
    }
}

// Start free generator
function startFreeGenerator() {
    isPremiumUser = false;
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
    updatePromptPreview();
    
    trackEvent('free_generator_started');
}

// Handle pro purchase
function handleProPurchase() {
    const gumroadUrl = 'https://gumroad.com/l/pro-prompt-generator';
    
    trackEvent('purchase_attempt', {
        product: 'pro_license',
        price: 15
    });
    
    window.open(gumroadUrl, '_blank');
}

// Show upgrade modal
function showUpgradeModal(feature) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 16px;
                text-align: center;
                max-width: 500px;
                margin: 20px;
            ">
                <h2 style="color: #374151; margin-bottom: 20px;">🚀 Upgrade to Premium</h2>
                <p style="color: #6b7280; margin-bottom: 30px;">
                    To ${feature}, upgrade to our Premium pack and unlock:
                </p>
                <ul style="text-align: left; color: #374151; margin-bottom: 30px;">
                    <li>✅ Save unlimited prompts</li>
                    <li>✅ Advanced prompt templates</li>
                    <li>✅ Export to PDF/JSON</li>
                    <li>✅ Premium variables</li>
                    <li>✅ Lifetime updates</li>
                </ul>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="this.closest('div').parentElement.remove()" 
                            style="padding: 12px 24px; border: 2px solid #e5e7eb; 
                                   background: white; border-radius: 8px; cursor: pointer;">
                        Maybe Later
                    </button>
                    <button onclick="handlePurchase(); this.closest('div').parentElement.remove();" 
                            style="padding: 12px 24px; border: none; background: #4a90e2; 
                                   color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Upgrade Now - $5
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    trackEvent('upgrade_modal_shown', { feature });
}

// Utility functions
function updatePromptStats(prompt) {
    const wordCount = prompt.split(/\s+/).length;
    const charCount = prompt.length;
    
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    
    if (wordCountEl) wordCountEl.textContent = `${wordCount} words`;
    if (charCountEl) charCountEl.textContent = `${charCount} characters`;
}

function showPromptVariables(prompt) {
    const variables = prompt.match(/{[^}]+}/g) || [];
    const variablesContainer = document.getElementById('prompt-variables');
    const variablesList = document.getElementById('variables-list');
    
    if (variables.length > 0 && variablesList) {
        variablesList.innerHTML = variables.map(v => 
            `<span class="variable-tag">${v}</span>`
        ).join('');
        variablesContainer.style.display = 'block';
    } else {
        variablesContainer.style.display = 'none';
    }
}

function formatValue(value) {
    return value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getDefaultTopic(promptType) {
    const topics = {
        linkedin: 'productivity tips',
        youtube: 'getting started guide',
        email: 'special offer',
        business: 'innovative solutions',
        blog: 'industry insights',
        social: 'brand awareness',
        product: 'premium features',
        persona: 'ideal customer',
        calendar: 'content strategy',
        sales: 'limited time offer'
    };
    return topics[promptType] || 'your topic';
}

function generatePromptTitle() {
    const type = formatValue(document.getElementById('prompt-type')?.value || '');
    const topic = document.getElementById('custom-topic')?.value || 'Custom';
    return `${type} - ${topic.substring(0, 30)}${topic.length > 30 ? '...' : ''}`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Analytics tracking
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    
    // Add your analytics service here
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
}

function initAnalyticsTracking() {
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackEvent('scroll_depth', { percent: scrollPercent });
        }
    });
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', { seconds: timeSpent });
    });
}

// Add some Easter eggs and engagement features
function addEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s infinite';
            
            // Add rainbow animation CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 4000);
        }
    });
}

// Call easter eggs function
addEasterEggs();

// Analytics and tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // In a real implementation, you would send this to your analytics service
    console.log('Event tracked:', eventName, properties);
    
    // Example for Google Analytics:
    // gtag('event', eventName, properties);
    
    // Example for other analytics services:
    // analytics.track(eventName, properties);
}

// Track user interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button') || e.target.classList.contains('purchase-button')) {
        trackEvent('purchase_button_clicked', {
            button_location: e.target.classList.contains('cta-button') ? 'hero' : 'pricing'
        });
    }
    
    if (e.target.closest('.prompt-card')) {
        const promptTitle = e.target.closest('.prompt-card').querySelector('h3').textContent;
        trackEvent('prompt_card_clicked', {
            prompt_name: promptTitle
        });
    }
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollDepth)) {
            trackEvent('scroll_depth', {
                depth: scrollDepth
            });
        }
    }
});