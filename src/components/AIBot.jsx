import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import './AIBot.css';

// Smart local AI brain - works without any backend
const healthKnowledge = {
  diabetes: {
    keywords: ['diabetes', 'sugar', 'glucose', 'insulin', 'blood sugar', 'diabetic', 'type 1', 'type 2', 'a1c'],
    response: "🩺 **Diabetes Overview:**\n\nDiabetes is a chronic condition where the body cannot properly process glucose.\n\n**Key Risk Factors:**\n• Family history of diabetes\n• BMI over 25\n• Sedentary lifestyle\n• Age over 45\n\n**Recommended Actions:**\n• Monitor fasting blood sugar regularly\n• Maintain a balanced diet low in refined carbs\n• Exercise at least 30 minutes daily\n\n💡 Use our **Diabetes Prediction** tool in the sidebar for a personalized risk assessment!"
  },
  heart: {
    keywords: ['heart', 'cardiac', 'chest pain', 'blood pressure', 'cholesterol', 'cardiovascular', 'ecg', 'heartbeat', 'palpitation'],
    response: "❤️ **Heart Health Guide:**\n\nHeart disease is the leading cause of death worldwide, but it's largely preventable.\n\n**Warning Signs:**\n• Chest pain or discomfort\n• Shortness of breath\n• Irregular heartbeat\n• Fatigue during physical activity\n\n**Prevention Tips:**\n• Keep blood pressure below 120/80\n• Maintain cholesterol under 200 mg/dL\n• Exercise regularly & manage stress\n• Avoid smoking and excessive alcohol\n\n💡 Try our **Heart Disease Predictor** for a quick risk check!"
  },
  skin: {
    keywords: ['skin', 'mole', 'rash', 'lesion', 'spot', 'acne', 'dermatology', 'melanoma', 'eczema', 'psoriasis', 'fungal', 'ringworm', 'burn'],
    response: "🔬 **Skin Health Information:**\n\nSkin conditions range from harmless moles to serious melanomas.\n\n**When to See a Doctor (ABCDE Rule):**\n• **A**symmetry — one half doesn't match\n• **B**order — irregular or blurred edges\n• **C**olor — uneven color distribution\n• **D**iameter — larger than 6mm\n• **E**volving — changing in size/shape/color\n\n💡 Use our **Skin Disease Detection** tool to upload or capture an image for instant AI analysis with multi-disease predictions!"
  },
  parkinson: {
    keywords: ['parkinson', 'tremor', 'shaking', 'neurological', 'brain', 'neurology', 'movement disorder', 'stiffness'],
    response: "🧠 **Neurological Health — Parkinson's:**\n\nParkinson's disease affects movement and is caused by reduced dopamine production.\n\n**Early Signs:**\n• Tremor in hands or fingers\n• Slowed movement (bradykinesia)\n• Rigid muscles\n• Speech changes\n\n**Management:**\n• Medications like Levodopa\n• Physical therapy for mobility\n• Regular exercise (walking, swimming)\n• Speech therapy if needed\n\n💡 Try our **Neurological Assessment** tool for a preliminary screening!"
  },
  bmi: {
    keywords: ['bmi', 'weight', 'overweight', 'underweight', 'obese', 'obesity', 'body mass', 'fat', 'thin', 'diet', 'calorie'],
    response: "⚖️ **BMI & Weight Management:**\n\n**BMI Categories:**\n• Under 18.5 → Underweight\n• 18.5–24.9 → Normal (Healthy)\n• 25–29.9 → Overweight\n• 30+ → Obese\n\n**Tips for Healthy Weight:**\n• Eat nutrient-dense whole foods\n• Drink 8+ glasses of water daily\n• Sleep 7-9 hours per night\n• Avoid sugary drinks and processed food\n\n💡 Use our **BMI Calculator** to check where you stand and get personalized food recommendations!"
  },
  appointment: {
    keywords: ['appointment', 'doctor', 'book', 'schedule', 'visit', 'consultation', 'specialist', 'hospital', 'clinic'],
    response: "📅 **Booking Appointments:**\n\nYou can manage your healthcare appointments right here!\n\n**How to book:**\n1. Click **Find Doctor** in the sidebar\n2. Choose a specialist based on your need\n3. Select a convenient time slot\n4. Confirm your appointment\n\n**Available Specialists:**\n• Cardiologist\n• Dermatologist\n• Neurologist\n• General Physician\n• Endocrinologist"
  },
  medicine: {
    keywords: ['medicine', 'medication', 'pill', 'drug', 'prescription', 'dosage', 'tablet', 'capsule', 'calendar', 'reminder'],
    response: "💊 **Medication Management:**\n\nNever miss a dose again with our Medication Calendar!\n\n**Features:**\n• Set medication schedules with exact times\n• Get browser notification alerts\n• Track taken/missed doses\n• View medication history\n\n💡 Open the **Medication Calendar** from the sidebar to start managing your prescriptions!"
  },
  greeting: {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'sup', 'yo', 'hola'],
    response: "👋 **Hello! Welcome to MedPredict AI!**\n\nI'm your personal health assistant. Here's what I can help you with:\n\n🔹 **Disease Predictions** — Diabetes, Heart, Skin, Parkinson's\n🔹 **BMI Calculator** — Check your weight category\n🔹 **Medication Calendar** — Never miss a pill\n🔹 **Patient History** — Track your scan records\n🔹 **Doctor Appointments** — Find & book specialists\n\nJust ask me anything about health, or type a topic like \"heart\", \"skin\", or \"diabetes\"!"
  },
  thanks: {
    keywords: ['thank', 'thanks', 'thx', 'appreciate', 'helpful', 'great', 'awesome', 'nice'],
    response: "😊 You're welcome! I'm always here to help with your health questions.\n\nFeel free to explore our prediction tools in the sidebar, or ask me anything else about:\n• Heart health\n• Diabetes risk\n• Skin conditions\n• Neurological assessment\n• BMI & weight management\n\nStay healthy! 💪"
  },
  help: {
    keywords: ['help', 'what can you do', 'features', 'how to use', 'guide', 'tutorial', 'what do you do'],
    response: "🤖 **MedPredict AI Assistant — Help Guide**\n\n**Available Features:**\n\n1️⃣ **Diabetes Prediction** — Enter medical parameters for risk assessment\n2️⃣ **Heart Disease Predictor** — Check cardiovascular health\n3️⃣ **Skin Disease Detection** — Upload or capture skin images for AI diagnosis\n4️⃣ **Neurological Assessment** — Parkinson's screening tool\n5️⃣ **BMI Calculator** — Weight analysis with diet suggestions\n6️⃣ **Medication Calendar** — Set pill reminders\n7️⃣ **Patient History** — View past scan records\n\n**How to use:** Simply click any tool in the left sidebar, or ask me a question!"
  }
};

function getSmartResponse(userMsg) {
  const lowerMsg = userMsg.toLowerCase().trim();
  
  // Check each knowledge category
  for (const [category, data] of Object.entries(healthKnowledge)) {
    for (const keyword of data.keywords) {
      if (lowerMsg.includes(keyword)) {
        return data.response;
      }
    }
  }
  
  // Fallback for unknown questions
  return `🤔 I understand you're asking about: "${userMsg}"\n\nWhile I may not have specific information on that topic, I can help you with:\n\n• **Heart Health** — type "heart"\n• **Diabetes** — type "diabetes"\n• **Skin Conditions** — type "skin"\n• **BMI & Weight** — type "bmi"\n• **Medications** — type "medicine"\n• **Appointments** — type "doctor"\n\nOr use any of the prediction tools in the sidebar for a detailed analysis!`;
}

export default function AIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "👋 Hello! I'm your **MedPredict AI Assistant**.\n\nI can help you with health questions about diabetes, heart disease, skin conditions, BMI, medications, and more.\n\nHow can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Try backend first, then fall back to smart local AI
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      }, 500);
      
    } catch (error) {
      // Use smart local AI — works perfectly offline
      const reply = getSmartResponse(userMsg);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      }, 800);
    }
  };

  // Simple markdown-like rendering
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className="bot-line" dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />;
    });
  };

  return (
    <>
      <div className={`ai-bot-container ${isOpen ? 'open' : ''}`}>
        <div className="ai-bot-header">
          <div className="ai-bot-title">
            <Sparkles size={20} />
            <span>MedPredict AI Assistant</span>
          </div>
          <button className="ai-bot-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="ai-bot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ${msg.sender}`}>
              <div className="message-content">
                {msg.sender === 'bot' ? renderText(msg.text) : msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-message bot">
              <div className="message-content typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-bot-input-area">
          <input 
            type="text" 
            placeholder="Ask about health, diabetes, skin..." 
            className="ai-input" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="ai-send-btn" onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <button className="ai-bot-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
