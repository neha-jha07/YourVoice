import { useEffect, useRef, useState } from 'react'
import './App.css'

type Language = 'EN' | 'HI' | 'HINGLISH'
type Step = 'describe' | 'details' | 'review' | 'success'

type Analysis = {
  category: string
  department: string
  portal: string
  reason: string
  questions: string[]
  aiMode: string
}

const copy = {
  EN: {
    hello: 'Namaste! How can we help?',
    prompt: "What's the problem in your neighbourhood?",
    placeholder: 'Example: A factory near my house has been releasing smoke every evening...',
    continue: 'Continue',
    recent: 'Popular complaint areas',
    home: 'YourVoice home',
    civicAssistant: 'CIVIC ASSISTANT · भारत',
    languageLabel: 'Language',
    trackComplaint: 'Track complaint',
    aiAssisted: 'AI assisted',
    noApiKey: 'No API key required',
    demoAnalysis: 'Demo analysis — no API key required',
    issue: 'issue',
    alreadyFiled: 'Already filed a complaint?',
    trackPrompt: 'Enter your reference number to see updates',
    trackPlaceholder: 'e.g. YV1234567890',
    trackStatus: 'Track status',
    dictateComplaint: 'Explain by voice',
    back: 'Back',
    detailsStep: 'STEP 2 OF 3',
    detailsHeading: 'Tell us a little more',
    detailsDescription: 'These details help route your complaint to the right office.',
    locationLabel: 'Where is this happening?',
    locationPlaceholder: 'Area, landmark or full address',
    locationExample: 'Use location example',
    durationLabel: 'How long has this been happening?',
    durationSuggestions: ['Less than a week', '1–4 weeks', '1–3 months', 'More than 3 months'],
    evidenceLabel: 'Add photos or videos',
    optional: 'optional',
    uploadEvidence: 'Upload evidence',
    evidenceHelp: 'Photos or short videos · Max 10 MB each',
    aiDetected: 'AI DETECTED',
    responsibleAuthority: 'LIKELY RESPONSIBLE AUTHORITY',
    officialPortal: 'View official portal',
    editComplaint: 'Edit complaint',
    reviewComplaint: 'Review complaint',
    reviewStep: 'STEP 3 OF 3',
    reviewHeading: 'Review your complaint',
    reviewDescription: 'Please check everything before it goes to the department.',
    complaintLabel: 'COMPLAINT',
    edit: 'Edit',
    locationReviewLabel: 'LOCATION',
    categoryLabel: 'CATEGORY',
    durationReviewLabel: 'DURATION',
    notSpecified: 'Not specified',
    routingTo: 'ROUTING TO',
    confirmAccuracy: 'I confirm that the above information is accurate.',
    goBack: 'Go back',
    preparing: 'Preparing...',
    confirmSubmit: 'Confirm & submit',
    complaintPrepared: 'COMPLAINT PREPARED',
    successTitle: 'Your voice has been recorded',
    successDescription: 'Your complaint has been prepared and is ready for the official portal.',
    referenceNumber: 'YOUR REFERENCE NUMBER',
    savedOnDevice: 'Saved on this device',
    openOfficialPortal: 'Open official portal',
    fileAnother: 'File another complaint',
    trackFuture: 'Track future updates',
    trackFutureDescription: 'Use your reference number to check the status here.',
    dictate: 'Dictate',
    dictateLocation: 'Dictate location',
    dictateDuration: 'Dictate duration',
    durationPlaceholder: 'e.g., about two weeks',
    listening: 'Listening... Speak now, or use your Wispr Flow shortcut.',
    wisprHint: 'Wispr Flow: focus a field and press your voice shortcut to dictate.',
    voiceError: 'Browser voice input failed. Use Wispr Flow in the focused field.',
  },
  HI: {
    hello: 'नमस्ते! हम आपकी मदद कैसे करें?',
    prompt: 'आपके इलाके में क्या समस्या है?',
    placeholder: 'उदाहरण: मेरे घर के पास फैक्ट्री से रोज शाम धुआँ निकलता है...',
    continue: 'आगे बढ़ें',
    recent: 'लोकप्रिय शिकायत क्षेत्र',
    home: 'YourVoice होम',
    civicAssistant: 'नागरिक सहायता · भारत',
    languageLabel: 'भाषा',
    trackComplaint: 'शिकायत ट्रैक करें',
    aiAssisted: 'AI की मदद से',
    noApiKey: 'API कुंजी की आवश्यकता नहीं',
    demoAnalysis: 'डेमो विश्लेषण — API कुंजी की आवश्यकता नहीं',
    issue: 'समस्या',
    alreadyFiled: 'पहले से शिकायत दर्ज की है?',
    trackPrompt: 'अपडेट देखने के लिए अपना संदर्भ नंबर दर्ज करें',
    trackPlaceholder: 'जैसे, YV1234567890',
    trackStatus: 'स्थिति देखें',
    dictateComplaint: 'बोलकर बताएं',
    back: 'वापस',
    detailsStep: 'चरण 2 / 3',
    detailsHeading: 'थोड़ा और बताएं',
    detailsDescription: 'ये विवरण आपकी शिकायत को सही कार्यालय तक पहुँचाने में मदद करेंगे।',
    locationLabel: 'यह समस्या कहाँ हो रही है?',
    locationPlaceholder: 'इलाका, पहचान-चिह्न या पूरा पता',
    locationExample: 'स्थान का उदाहरण इस्तेमाल करें',
    durationLabel: 'यह समस्या कब से हो रही है?',
    durationSuggestions: ['एक हफ्ते से कम', '1–4 हफ्ते', '1–3 महीने', '3 महीने से अधिक'],
    evidenceLabel: 'फ़ोटो या वीडियो जोड़ें',
    optional: 'वैकल्पिक',
    uploadEvidence: 'सबूत अपलोड करें',
    evidenceHelp: 'फ़ोटो या छोटे वीडियो · हर फ़ाइल अधिकतम 10 MB',
    aiDetected: 'AI द्वारा पहचानी गई समस्या',
    responsibleAuthority: 'संभावित जिम्मेदार विभाग',
    officialPortal: 'आधिकारिक पोर्टल देखें',
    editComplaint: 'शिकायत संपादित करें',
    reviewComplaint: 'शिकायत की समीक्षा करें',
    reviewStep: 'चरण 3 / 3',
    reviewHeading: 'अपनी शिकायत की समीक्षा करें',
    reviewDescription: 'विभाग को भेजने से पहले कृपया सभी विवरण जाँच लें।',
    complaintLabel: 'शिकायत',
    edit: 'संपादित करें',
    locationReviewLabel: 'स्थान',
    categoryLabel: 'श्रेणी',
    durationReviewLabel: 'अवधि',
    notSpecified: 'उल्लेख नहीं किया',
    routingTo: 'यहाँ भेजा जाएगा',
    confirmAccuracy: 'मैं पुष्टि करता/करती हूँ कि ऊपर दी गई जानकारी सही है।',
    goBack: 'वापस जाएँ',
    preparing: 'तैयार किया जा रहा है...',
    confirmSubmit: 'पुष्टि करें और जमा करें',
    complaintPrepared: 'शिकायत तैयार है',
    successTitle: 'आपकी आवाज़ दर्ज हुई',
    successDescription: 'आपकी शिकायत तैयार है और आधिकारिक पोर्टल पर जमा करने के लिए उपलब्ध है।',
    referenceNumber: 'आपका संदर्भ नंबर',
    savedOnDevice: 'इस डिवाइस पर सहेजा गया',
    openOfficialPortal: 'आधिकारिक पोर्टल खोलें',
    fileAnother: 'एक और शिकायत दर्ज करें',
    trackFuture: 'आगे की स्थिति देखें',
    trackFutureDescription: 'अपडेट देखने के लिए अपना संदर्भ नंबर इस्तेमाल करें।',
    dictate: 'बोलें',
    dictateLocation: 'स्थान बोलकर लिखें',
    dictateDuration: 'अवधि बोलकर लिखें',
    durationPlaceholder: 'जैसे, लगभग दो हफ्ते',
    listening: 'सुन रहे हैं... बोलें या Wispr Flow शॉर्टकट इस्तेमाल करें।',
    wisprHint: 'Wispr Flow: फ़ील्ड चुनें और बोलने के लिए अपना वॉइस शॉर्टकट दबाएँ।',
    voiceError: 'ब्राउज़र वॉइस इनपुट विफल हुआ। चुने हुए फ़ील्ड में Wispr Flow इस्तेमाल करें।',
  },
  HINGLISH: {
    hello: 'Namaste! Main aapki madad karunga.',
    prompt: 'Aapke area mein kya problem hai?',
    placeholder: 'Example: Mere ghar ke paas factory se har shaam pollution ho raha hai...',
    continue: 'Aage badhein',
    recent: 'Popular complaint areas',
    home: 'YourVoice home',
    civicAssistant: 'CIVIC ASSISTANT · भारत',
    languageLabel: 'Bhasha',
    trackComplaint: 'Complaint track karein',
    aiAssisted: 'AI ki madad se',
    noApiKey: 'API key ki zaroorat nahi',
    demoAnalysis: 'Demo analysis — API key ki zaroorat nahi',
    issue: 'issue',
    alreadyFiled: 'Pehle se complaint darj ki hai?',
    trackPrompt: 'Updates dekhne ke liye apna reference number dalein',
    trackPlaceholder: 'e.g. YV1234567890',
    trackStatus: 'Status dekhein',
    dictateComplaint: 'Bolkar batayein',
    back: 'Peeche',
    detailsStep: 'STEP 2 OF 3',
    detailsHeading: 'Thoda aur batayein',
    detailsDescription: 'Yeh details aapki complaint ko sahi office tak pahunchane mein madad karengi.',
    locationLabel: 'Yeh problem kahan ho rahi hai?',
    locationPlaceholder: 'Area, landmark ya poora address',
    locationExample: 'Location example use karein',
    durationLabel: 'Yeh problem kab se ho rahi hai?',
    durationSuggestions: ['Ek hafte se kam', '1–4 hafte', '1–3 mahine', '3 mahine se zyada'],
    evidenceLabel: 'Photos ya videos add karein',
    optional: 'optional',
    uploadEvidence: 'Evidence upload karein',
    evidenceHelp: 'Photos ya chhote videos · Har file max 10 MB',
    aiDetected: 'AI NE PEHCHANA',
    responsibleAuthority: 'MUMKIN ZIMMEDAR VIBHAG',
    officialPortal: 'Official portal dekhein',
    editComplaint: 'Complaint edit karein',
    reviewComplaint: 'Complaint review karein',
    reviewStep: 'STEP 3 OF 3',
    reviewHeading: 'Apni complaint review karein',
    reviewDescription: 'Vibhag ko bhejne se pehle saari details check karein.',
    complaintLabel: 'COMPLAINT',
    edit: 'Edit karein',
    locationReviewLabel: 'LOCATION',
    categoryLabel: 'CATEGORY',
    durationReviewLabel: 'DURATION',
    notSpecified: 'Nahi bataya',
    routingTo: 'YAHAN BHEJA JAYEGA',
    confirmAccuracy: 'Main confirm karta/karti hoon ki upar di gayi jaankari sahi hai.',
    goBack: 'Wapas jaayein',
    preparing: 'Taiyaar ho raha hai...',
    confirmSubmit: 'Confirm karke submit karein',
    complaintPrepared: 'COMPLAINT TAIYAAR HAI',
    successTitle: 'Aapki awaaz darj ho gayi',
    successDescription: 'Aapki complaint taiyaar hai aur official portal par jama karne ke liye available hai.',
    referenceNumber: 'AAPKA REFERENCE NUMBER',
    savedOnDevice: 'Is device par save kiya gaya',
    openOfficialPortal: 'Official portal kholein',
    fileAnother: 'Ek aur complaint darj karein',
    trackFuture: 'Aage ke updates track karein',
    trackFutureDescription: 'Updates dekhne ke liye apna reference number use karein.',
    dictate: 'Bolkar likhein',
    dictateLocation: 'Location bolkar likhein',
    dictateDuration: 'Duration bolkar likhein',
    durationPlaceholder: 'e.g., lagbhag do hafte',
    listening: 'Sun rahe hain... boliye ya Wispr Flow shortcut use karein.',
    wisprHint: 'Wispr Flow: field select karke apna voice shortcut dabayein.',
    voiceError: 'Browser voice input kaam nahi kiya. Focused field mein Wispr Flow use karein.',
  },
}

const topics = [
  { icon: '🗑', en: 'Garbage', hi: 'कचरा', hinglish: 'Kachra', key: 'garbage dump near my house', hiKey: 'मेरे घर के पास कचरे का ढेर है', hinglishKey: 'Mere ghar ke paas kachre ka dher hai' },
  { icon: '💧', en: 'Water', hi: 'पानी', hinglish: 'Paani', key: 'no water supply in my area', hiKey: 'मेरे इलाके में पानी की आपूर्ति नहीं है', hinglishKey: 'Mere area mein paani nahi aa raha hai' },
  { icon: '🛣', en: 'Road', hi: 'सड़क', hinglish: 'Sadak', key: 'big potholes on the road', hiKey: 'सड़क पर बड़े गड्ढे हैं', hinglishKey: 'Sadak par bade gaddhe hain' },
  { icon: '🌫', en: 'Air', hi: 'वायु', hinglish: 'Hawa', key: 'factory air pollution and smoke', hiKey: 'फैक्ट्री से धुआँ और वायु प्रदूषण हो रहा है', hinglishKey: 'Factory se dhuaan aur pollution ho raha hai' },
]

const analysisTranslations: Record<Exclude<Language, 'EN'>, Record<string, string>> = {
  HI: {
    'Air pollution': 'वायु प्रदूषण',
    'Garbage & waste': 'कचरा और अपशिष्ट',
    'Water & drainage': 'जल आपूर्ति और जल निकासी',
    'Road damage': 'सड़क की क्षति',
    'General civic issue': 'सामान्य नागरिक समस्या',
    'State Pollution Control Board': 'राज्य प्रदूषण नियंत्रण बोर्ड',
    'Municipal Corporation / Nagar Palika': 'नगर निगम / नगर पालिका',
    'Public Health Engineering / Jal Nigam': 'जन स्वास्थ्य अभियांत्रिकी / जल निगम',
    'Municipal Corporation / PWD': 'नगर निगम / लोक निर्माण विभाग',
    'District Magistrate / Municipal Corporation': 'जिलाधिकारी / नगर निगम',
    'Industrial emissions are regulated by pollution control authorities.': 'औद्योगिक उत्सर्जन को प्रदूषण नियंत्रण प्राधिकरण नियंत्रित करते हैं।',
    'Waste collection and sanitation are handled by local civic bodies.': 'कचरा संग्रह और सफ़ाई का काम स्थानीय निकायों द्वारा किया जाता है।',
    'Waste collection and public sanitation fall under local civic bodies.': 'कचरा संग्रह और सार्वजनिक सफ़ाई स्थानीय निकायों के अंतर्गत आते हैं।',
    'Water supply and drainage infrastructure are managed by local water authorities.': 'जल आपूर्ति और निकासी व्यवस्था का प्रबंधन स्थानीय जल प्राधिकरण करते हैं।',
    'Road maintenance is handled by the municipality or Public Works Department.': 'सड़कों का रखरखाव नगर निकाय या लोक निर्माण विभाग करता है।',
    'The complaint can be routed through the district grievance system.': 'शिकायत को जिला शिकायत निवारण प्रणाली के माध्यम से भेजा जा सकता है।',
    'Your complaint will be routed through the general district grievance system.': 'आपकी शिकायत सामान्य जिला शिकायत निवारण प्रणाली के माध्यम से भेजी जाएगी।',
  },
  HINGLISH: {
    'Air pollution': 'Hawa ka pradushan',
    'Garbage & waste': 'Kachra aur waste',
    'Water & drainage': 'Paani aur drainage',
    'Road damage': 'Sadak ki kharabi',
    'General civic issue': 'Aam civic problem',
    'State Pollution Control Board': 'State Pollution Control Board',
    'Municipal Corporation / Nagar Palika': 'Municipal Corporation / Nagar Palika',
    'Public Health Engineering / Jal Nigam': 'Public Health Engineering / Jal Nigam',
    'Municipal Corporation / PWD': 'Municipal Corporation / PWD',
    'District Magistrate / Municipal Corporation': 'District Magistrate / Municipal Corporation',
    'Industrial emissions are regulated by pollution control authorities.': 'Factory emissions ko pollution control authorities regulate karti hain.',
    'Waste collection and sanitation are handled by local civic bodies.': 'Kachra collection aur safai local civic bodies sambhalti hain.',
    'Waste collection and public sanitation fall under local civic bodies.': 'Kachra collection aur public safai local civic bodies ke under aati hai.',
    'Water supply and drainage infrastructure are managed by local water authorities.': 'Water supply aur drainage ka management local water authorities karti hain.',
    'Road maintenance is handled by the municipality or Public Works Department.': 'Road maintenance municipality ya Public Works Department sambhalta hai.',
    'The complaint can be routed through the district grievance system.': 'Complaint ko district grievance system ke through bheja ja sakta hai.',
    'Your complaint will be routed through the general district grievance system.': 'Aapki complaint general district grievance system ke through bheji jayegi.',
  },
}

const localizeAnalysisText = (language: Language, value: string) =>
  language === 'EN' ? value : analysisTranslations[language][value] || value

function App() {
  const [language, setLanguage] = useState<Language>('EN')
  const [step, setStep] = useState<Step>('describe')
  const [complaint, setComplaint] = useState('')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('')
  const [evidence, setEvidence] = useState<File[]>([])
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [reference, setReference] = useState('')
  const [wisprHint, setWisprHint] = useState('')
  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const durationInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) recognitionRef.current = new SpeechRecognition()
  }, [])

  const startListening = () => {
    textareaRef.current?.focus()
    setListening(true)
    setWisprHint(copy[language].wisprHint)

    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'HI' ? 'hi-IN' : 'en-IN'
      recognitionRef.current.interimResults = false
      recognitionRef.current.onresult = (event: any) => {
        setComplaint((current) => `${current}${current ? ' ' : ''}${event.results[0][0].transcript}`)
      }
      recognitionRef.current.onend = () => setListening(false)
      recognitionRef.current.start()
    }
  }

  const startFieldDictation = (input: HTMLInputElement | null, onTranscript: (transcript: string) => void) => {
    input?.focus()
    const wisprHint = copy[language].wisprHint
    const listeningHint = copy[language].listening
    setWisprHint(wisprHint)

    if (!recognitionRef.current) {
      setListening(false)
      return
    }

    recognitionRef.current.lang = language === 'HI' ? 'hi-IN' : 'en-IN'
    recognitionRef.current.interimResults = false
    recognitionRef.current.onresult = (event: any) => {
      onTranscript(event.results[0][0].transcript)
      setWisprHint(wisprHint)
    }
    recognitionRef.current.onend = () => {
      setListening(false)
      setWisprHint((currentHint) => currentHint === listeningHint ? wisprHint : currentHint)
    }
    recognitionRef.current.onerror = (event: any) => {
      setListening(false)
      setWisprHint(`${copy[language].voiceError} (${event.error})`)
    }
    setListening(true)
    setWisprHint(listeningHint)
    recognitionRef.current.start()
  }

  const analyzeComplaint = async () => {
    if (!complaint.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: complaint, language }),
      })
      if (response.ok) setAnalysis(await response.json())
      else throw new Error('API unavailable')
    } catch {
      const text = complaint.toLowerCase()
      if (/pollution|smoke|factory|dhua|वायु|फैक्टरी/.test(text)) {
        setAnalysis({ category: 'Air pollution', department: 'State Pollution Control Board', portal: 'https://cpcb.nic.in/online-complaint/', reason: 'Industrial emissions are regulated by pollution control authorities.', questions: ['Where exactly is the problem?', 'How long has it been happening?', 'Do you have photos or videos?'], aiMode: 'Demo analysis — no API key required' })
      } else if (/garbage|trash|kuda|कचरा|कूड़ा/.test(text)) {
        setAnalysis({ category: 'Garbage & waste', department: 'Municipal Corporation / Nagar Palika', portal: 'https://swachhbharatmission.gov.in/', reason: 'Waste collection and sanitation are handled by local civic bodies.', questions: ['Where exactly is the problem?', 'How long has it been happening?', 'Do you have photos or videos?'], aiMode: 'Demo analysis — no API key required' })
      } else {
        setAnalysis({ category: 'General civic issue', department: 'District Magistrate / Municipal Corporation', portal: 'https://pgportal.gov.in/', reason: 'The complaint can be routed through the district grievance system.', questions: ['Where exactly is the problem?', 'How long has it been happening?', 'Do you have photos or videos?'], aiMode: 'Demo analysis — no API key required' })
      }
    } finally {
      setLoading(false)
      setStep('details')
    }
  }

  const submitComplaint = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint, location, duration, category: analysis?.category, department: analysis?.department, portal: analysis?.portal }),
      })
      if (response.ok) {
        const data = await response.json()
        setReference(data.reference)
      } else setReference(`YV${Date.now().toString().slice(-10)}`)
    } catch {
      setReference(`YV${Date.now().toString().slice(-10)}`)
    } finally {
      setLoading(false)
      setStep('success')
    }
  }

  const goBack = () => {
    if (step === 'review') setStep('details')
    else if (step === 'details') setStep('describe')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setStep('describe')} aria-label={copy[language].home}>
          <span className="brand-mark">v</span>
          <span>YourVoice</span>
        </button>
        <div className="header-actions">
          <button className="track-button" onClick={() => document.querySelector<HTMLInputElement>('#track-input')?.focus()}>
            <span>◎</span> {copy[language].trackComplaint}
          </button>
          <div className="language-switch" aria-label={copy[language].languageLabel}>
            {(['EN', 'HI', 'HINGLISH'] as Language[]).map((item) => (
              <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item}</button>
            ))}
          </div>
        </div>
      </header>

      <main>
        {step === 'describe' && (
          <>
            <section className="hero-section">
              <div className="hero-copy">
                <span className="eyebrow">{copy[language].civicAssistant}</span>
                <h1>{copy[language].hello}</h1>
                <h2>{copy[language].prompt}</h2>

                <div className="composer">
                  <textarea ref={textareaRef} value={complaint} onChange={(event) => setComplaint(event.target.value)} placeholder={copy[language].placeholder} />
                  <div className="composer-footer">
                    <button className={`mic-button ${listening ? 'listening' : ''}`} onClick={startListening} title={copy[language].dictateComplaint}>
                      <span className="mic-icon">◉</span>
                    </button>
                    <span className="voice-label">{listening ? 'Wispr Flow ready' : 'Wispr Flow'}</span>
                    <button className="continue-button" onClick={analyzeComplaint} disabled={!complaint.trim() || loading}>{loading ? 'Analyzing...' : copy[language].continue}<span>→</span></button>
                  </div>
                </div>

                <div className="ai-status"><span>✦</span> {copy[language].aiAssisted} · <strong>{analysis ? (analysis.aiMode === 'Demo analysis — no API key required' ? copy[language].demoAnalysis : analysis.aiMode) : copy[language].noApiKey}</strong></div>
              </div>

              <div className="india-illustration" aria-label="India civic illustration">
                <div className="sun"></div>
                <div className="cloud cloud-one"></div>
                <div className="cloud cloud-two"></div>
                <div className="mountain"></div>
                <div className="road"></div>
                <div className="building building-left"><i></i><i></i><i></i></div>
                <div className="building building-right"><i></i><i></i><i></i></div>
                <div className="tree"><b></b><span></span></div>
                <div className="person"><b></b><span></span></div>
              </div>
            </section>

            <section className="topic-section">
              <h3>{copy[language].recent}</h3>
              <div className="topic-grid">
                {topics.map((topic) => (
                  <button key={topic.en} onClick={() => setComplaint(language === 'HI' ? topic.hiKey : language === 'HINGLISH' ? topic.hinglishKey : topic.key)}>
                    <span className="topic-icon">{topic.icon}</span>
                    <span><strong>{language === 'HI' ? topic.hi : language === 'HINGLISH' ? topic.hinglish : topic.en}</strong><small>{language === 'HI' ? topic.hi : language === 'HINGLISH' ? topic.hinglish : topic.en} {copy[language].issue}</small></span>
                    <span className="topic-arrow">›</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="track-section">
              <div>
                <span className="track-symbol">◎</span>
                <div><strong>{copy[language].alreadyFiled}</strong><small>{copy[language].trackPrompt}</small></div>
              </div>
              <div className="track-form">
                <input id="track-input" placeholder={copy[language].trackPlaceholder} />
                <button>{copy[language].trackStatus}</button>
              </div>
            </section>
          </>
        )}

        {step === 'details' && analysis && (
          <section className="form-page">
            <button className="back-button" onClick={goBack}>← {copy[language].back}</button>
            <div className="progress"><span className="done"></span><span className="active"></span><span></span></div>
            <div className="form-heading">
              <span className="step-label">{copy[language].detailsStep}</span>
              <h1>{copy[language].detailsHeading}</h1>
              <p>{copy[language].detailsDescription}</p>
            </div>
            <div className="detail-layout">
              <div className="detail-card">
                <label>{copy[language].locationLabel} <b>*</b></label>
                <div className="voice-input-row">
                  <input ref={locationInputRef} value={location} onChange={(event) => setLocation(event.target.value)} placeholder={copy[language].locationPlaceholder} />
                  <button type="button" className="field-voice-button" onClick={() => startFieldDictation(locationInputRef.current, setLocation)} disabled={listening} aria-label={copy[language].dictateLocation}>
                    <span aria-hidden="true">◉</span>{copy[language].dictate}
                  </button>
                </div>
                <button className="location-button" onClick={() => setLocation('Loni, Ghaziabad, Uttar Pradesh')}>⌖ {copy[language].locationExample}</button>

                <label>{copy[language].durationLabel}</label>
                <div className="voice-input-row">
                  <input ref={durationInputRef} list="duration-suggestions" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder={copy[language].durationPlaceholder} />
                  <datalist id="duration-suggestions">
                    {copy[language].durationSuggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
                  </datalist>
                  <button type="button" className="field-voice-button" onClick={() => startFieldDictation(durationInputRef.current, setDuration)} disabled={listening} aria-label={copy[language].dictateDuration}>
                    <span aria-hidden="true">◉</span>{copy[language].dictate}
                  </button>
                </div>

                <label>{copy[language].evidenceLabel} <span>({copy[language].optional})</span></label>
                <label className="upload-box">
                  <input type="file" accept="image/*,video/*" multiple onChange={(event) => setEvidence(Array.from(event.target.files || []))} />
                  <span className="upload-icon">＋</span>
                  <strong>{copy[language].uploadEvidence}</strong>
                  <small>{evidence.length ? evidence.map((file) => file.name).join(', ') : copy[language].evidenceHelp}</small>
                </label>
              </div>

              <aside className="analysis-card">
                <span className="spark">✦</span>
                <div><small>{copy[language].aiDetected}</small><h3>{localizeAnalysisText(language, analysis.category)}</h3></div>
                <hr />
                <small>{copy[language].responsibleAuthority}</small>
                <strong>{localizeAnalysisText(language, analysis.department)}</strong>
                <p>{localizeAnalysisText(language, analysis.reason)}</p>
                <a href={analysis.portal} target="_blank" rel="noreferrer">{copy[language].officialPortal} ↗</a>
              </aside>
            </div>
            <div className="form-actions"><button className="secondary" onClick={goBack}>{copy[language].editComplaint}</button><button className="primary" onClick={() => setStep('review')} disabled={!location.trim()}>{copy[language].reviewComplaint} <span>→</span></button></div>
          </section>
        )}

        {step === 'review' && analysis && (
          <section className="form-page review-page">
            <button className="back-button" onClick={goBack}>← {copy[language].back}</button>
            <div className="progress"><span className="done"></span><span className="done"></span><span className="active"></span></div>
            <div className="form-heading"><span className="step-label">{copy[language].reviewStep}</span><h1>{copy[language].reviewHeading}</h1><p>{copy[language].reviewDescription}</p></div>
            <div className="review-card">
              <div className="review-row"><div><small>{copy[language].complaintLabel}</small><p>{complaint}</p></div><button onClick={() => setStep('describe')}>{copy[language].edit}</button></div>
              <div className="review-row"><div><small>{copy[language].locationReviewLabel}</small><p>{location}</p></div><button onClick={() => setStep('details')}>{copy[language].edit}</button></div>
              <div className="review-grid"><div><small>{copy[language].categoryLabel}</small><strong>{localizeAnalysisText(language, analysis.category)}</strong></div><div><small>{copy[language].durationReviewLabel}</small><strong>{duration || copy[language].notSpecified}</strong></div></div>
              <div className="authority-box"><span>✦</span><div><small>{copy[language].routingTo}</small><strong>{localizeAnalysisText(language, analysis.department)}</strong><p>{localizeAnalysisText(language, analysis.reason)}</p></div></div>
              <label className="confirm-check"><input type="checkbox" defaultChecked /> <span>{copy[language].confirmAccuracy}</span></label>
            </div>
            <div className="form-actions"><button className="secondary" onClick={() => setStep('details')}>{copy[language].goBack}</button><button className="primary" onClick={submitComplaint} disabled={loading}>{loading ? copy[language].preparing : copy[language].confirmSubmit} <span>→</span></button></div>
          </section>
        )}

        {step === 'success' && (
          <section className="success-page">
            <div className="success-icon">✓</div>
            <span className="step-label">{copy[language].complaintPrepared}</span>
            <h1>{copy[language].successTitle}</h1>
            <p>{copy[language].successDescription}</p>
            <div className="reference-card"><small>{copy[language].referenceNumber}</small><strong>{reference}</strong><span>{copy[language].savedOnDevice}</span></div>
            <div className="success-actions"><button className="primary" onClick={() => window.open(analysis?.portal, '_blank')}>{copy[language].openOfficialPortal} <span>↗</span></button><button className="secondary" onClick={() => setStep('describe')}>{copy[language].fileAnother}</button></div>
            <div className="next-step"><span>◎</span><div><strong>{copy[language].trackFuture}</strong><p>{copy[language].trackFutureDescription}</p></div></div>
          </section>
        )}
      </main>

      {wisprHint && <div className="wispr-hint"><span>⌁</span>{wisprHint}</div>}
    </div>
  )
}

export default App
