import { useState, useEffect } from 'react';
import { Brain, Lightbulb, ArrowRight, Check, Code, PenTool, Puzzle } from 'lucide-react';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [currentProblem, setCurrentProblem] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const exampleProblems = [
    "How might we reduce plastic waste in urban environments?",
    "How can we improve remote learning engagement for middle school students?",
    "What solutions could help elderly people maintain social connections?",
    "How might we optimize logistics for last-mile delivery in rural areas?"
  ];

  // Typing animation effect
  useEffect(() => {
    const text = exampleProblems[currentProblem];
    let index = 0;
    
    if (typedText.length === 0) {
      const interval = setInterval(() => {
        if (index < text.length) {
          setTypedText(prev => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setTypedText('');
            setCurrentProblem((prev) => (prev + 1) % exampleProblems.length);
          }, 3000);
        }
      }, 70);
      
      return () => clearInterval(interval);
    }
  }, [typedText, currentProblem]);

  // Loading animation
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Fade-in animation for features section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation classes
  const fadeIn = isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000';
  const slideIn = isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-indigo-950 z-50">
          <div className="relative">
            <Brain size={64} className="animate-pulse text-purple-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-ping" />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain size={32} className="text-teal-400" />
          <span className="font-bold text-2xl bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">ProblemAI</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
        </nav>
        <button className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-teal-500/20">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section className={`container mx-auto px-4 py-16 md:py-24 ${fadeIn}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Generate <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Powerful Problem Statements</span> with AI
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            Transform vague challenges into clear, actionable problem statements that drive innovation and solutions
          </p>
          
          {/* Interactive Problem Statement Generator Preview */}
          <div className="bg-indigo-900/50 border border-indigo-700 rounded-xl p-6 mb-10 shadow-xl">
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm text-gray-400">AI Problem Generator</div>
              </div>
              <div className="bg-indigo-950 rounded-lg p-6 flex flex-col">
                <div className="text-sm text-gray-400 mb-2">Enter your challenge:</div>
                <div className="bg-indigo-800/50 rounded-lg p-4 mb-4 min-h-12">
                  <span className="text-gray-300">I need to find a way to...</span>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 py-2 rounded-lg flex items-center justify-center transition-colors">
                  <span>Generate Problem Statement</span>
                  <ArrowRight size={16} className="ml-2" />
                </button>
                <div className="mt-6">
                  <div className="text-sm text-gray-400 mb-2">Your problem statement:</div>
                  <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-lg p-4 min-h-16 border-l-4 border-teal-400">
                    <span className="text-teal-300 font-medium">{typedText}</span>
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-3 rounded-full font-medium transition-all flex items-center justify-center">
              Try It Free
              <ArrowRight size={18} className="ml-2 animate-pulse" />
            </button>
            <button className="bg-transparent border border-purple-500 hover:bg-purple-900/20 px-8 py-3 rounded-full font-medium transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Powerful Features for Perfect <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Problem Statements</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="w-12 h-12 text-purple-400" />,
              title: "AI-Powered Analysis",
              description: "Our advanced AI analyzes your input to identify core challenges and opportunities."
            },
            {
              icon: <PenTool className="w-12 h-12 text-teal-400" />,
              title: "Custom Formatting",
              description: "Generate problem statements in various formats for different methodologies."
            },
            {
              icon: <Puzzle className="w-12 h-12 text-pink-400" />,
              title: "Context Refinement",
              description: "Fine-tune problem contexts with industry-specific insights and parameters."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`bg-indigo-900/30 border border-indigo-800 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all hover:-translate-y-1 ${slideIn} transition-all duration-700 delay-${index * 200}`}
            >
              <div className="bg-indigo-950/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24 bg-indigo-950/50 rounded-3xl my-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Works</span>
        </h2>
        
        <div className="max-w-4xl mx-auto">
          {[
            {
              step: 1,
              title: "Describe Your Challenge",
              description: "Enter a brief description of the challenge or opportunity you're facing."
            },
            {
              step: 2,
              title: "AI Processing",
              description: "Our AI analyzes your input, identifies key elements, and structures a clear problem statement."
            },
            {
              step: 3,
              title: "Refine & Download",
              description: "Fine-tune the generated problem statement and download it in your preferred format."
            }
          ].map((step, index) => (
            <div key={index} className="flex mb-12 items-start">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                {step.step}
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Trusted by <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Innovators</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              quote: "This tool transformed how our team approaches problem definition. The clarity it brings to our innovation process is invaluable.",
              author: "Sarah Chen",
              title: "Innovation Director, TechCorp"
            },
            {
              quote: "We've cut our problem definition time by 70% while improving the quality of our statements. A game-changer for our design sprints.",
              author: "Marcus Johnson",
              title: "Product Manager, InnovateCo"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 rounded-xl border border-indigo-800">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Lightbulb key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-gray-400 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Simple, Transparent <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Pricing</span>
        </h2>
        <p className="text-xl text-center text-gray-300 mb-16 max-w-2xl mx-auto">
          Choose the plan that works best for your innovation needs
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Starter",
              price: "$9",
              features: [
                "10 problem statements/month",
                "Basic formatting options",
                "Email support"
              ]
            },
            {
              name: "Professional",
              price: "$29",
              features: [
                "50 problem statements/month",
                "Advanced formatting options",
                "Industry-specific insights",
                "Priority support"
              ],
              popular: true
            },
            {
              name: "Enterprise",
              price: "$99",
              features: [
                "Unlimited problem statements",
                "Custom integrations",
                "Team collaboration features",
                "Dedicated account manager"
              ]
            }
          ].map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-8 relative ${plan.popular ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500' : 'bg-indigo-900/30 border border-indigo-800'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check size={20} className="text-teal-400 mr-2 shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full rounded-lg py-3 font-medium transition-all ${plan.popular ? 'bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600' : 'bg-indigo-700 hover:bg-indigo-600'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto border border-indigo-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Problem Solving</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of innovators who are defining better problems and finding better solutions
          </p>
          <button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 px-8 py-4 rounded-full font-medium text-lg transition-all hover:shadow-lg hover:shadow-teal-500/20 animate-pulse">
            Start Generating Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-indigo-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Brain size={24} className="text-teal-400" />
            <span className="font-bold text-xl bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">ProblemAI</span>
          </div>
          <div className="flex space-x-8 mb-4 md:mb-0">
            <a href="#" className="hover:text-teal-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Contact</a>
          </div>
          <div className="text-gray-400">© 2025 ProblemAI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}