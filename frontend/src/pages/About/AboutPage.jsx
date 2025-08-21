import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useState } from "react";

export function AboutPage() {
  const [openFeature, setOpenFeature] = useState(null);

  const toggleFeature = (index) => {
    setOpenFeature(openFeature === index ? null : index);
  };

  const features = [
    {
      title: "📝 Create Posts",
      description: "Share text and images with your network. Upload photos and express yourself freely with our easy-to-use post creator."
    },
    {
      title: "❤️ Like & Comment", 
      description: "Engage with posts from other users. Build connections through meaningful interactions and conversations."
    },
    {
      title: "👤 User Profiles",
      description: "Customize your profile and view others. Add your bio, profile picture, and showcase your personality."
    },
    {
      title: "🔄 Real-time Feed",
      description: "Stay updated with the latest posts. Never miss what your friends and connections are sharing."
    },
    {
      title: "🔍 Search",
      description: "Find posts and discover new content. Explore topics and connect with like-minded users."
    },
    {
      title: "📱 Mobile Responsive",
      description: "Works great on all devices. Enjoy the full QuackBook experience on desktop, tablet, or mobile."
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="card">
              <div className="card-content">
                <div className="content">
                  <h1 className="title is-2 has-text-centered mb-5">
                    What is Quackbook?
                  </h1>
                  
                  <div className="block">
                    <p className="is-size-5">
                      QuackBook is a social media platform where users can share their thoughts, 
                      images, and connect with friends. Think of it as a friendly place to "quack" 
                      about your day and see what others are up to!
                    </p>
                  </div>

                  <div className="block">
                    <h2 className="title is-4">Features</h2>
                    <div className="content">
                      {features.map((feature, index) => (
                        <div key={index} className="message mb-3">
                          <div 
                            className="message-header" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleFeature(index)}
                          >
                            <p>{feature.title}</p>
                            <span className="icon">
                              <i className={`fas ${openFeature === index ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                            </span>
                          </div>
                          {openFeature === index && (
                            <div className="message-body">
                              {feature.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="block">
                    <h2 className="title is-4 has-text-centered">Technology Stack</h2>
                    <div className="columns is-mobile is-multiline is-centered">
                      <div className="column is-narrow">
                        <div className="card has-text-centered" style={{minWidth: '120px'}}>
                          <div className="card-content p-4">
                            <span className="is-size-2">⚛️</span>
                            <p className="is-size-6 has-text-weight-semibold mt-2">React</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="column is-narrow">
                        <div className="card has-text-centered" style={{minWidth: '120px'}}>
                          <div className="card-content p-4">
                            <span className="is-size-2">🔌</span>
                            <p className="is-size-6 has-text-weight-semibold mt-2">Node.js</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="column is-narrow">
                        <div className="card has-text-centered" style={{minWidth: '120px'}}>
                          <div className="card-content p-4">
                            <span className="is-size-2">🚀</span>
                            <p className="is-size-6 has-text-weight-semibold mt-2">Express</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="column is-narrow">
                        <div className="card has-text-centered" style={{minWidth: '120px'}}>
                          <div className="card-content p-4">
                            <span className="is-size-2">🍃</span>
                            <p className="is-size-6 has-text-weight-semibold mt-2">MongoDB</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="column is-narrow">
                        <div className="card has-text-centered" style={{minWidth: '120px'}}>
                          <div className="card-content p-4">
                            <span className="is-size-2">🎨</span>
                            <p className="is-size-6 has-text-weight-semibold mt-2">Bulma CSS</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="block">
                    <h2 className="title is-4 has-text-centered">Getting Started</h2>
                    <div className="content">
                      <div className="steps has-content-centered">
                        
                        {/* Step 1 */}
                        <div className="step-item is-completed is-success">
                          <div className="step-marker">
                            <span className="icon">
                              <i className="fa fa-user-plus"></i>
                            </span>
                          </div>
                          <div className="step-details">
                            <p className="step-title">Create Account</p>
                            <p>Create an account by clicking "Sign Up"</p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="step-item is-completed is-info">
                          <div className="step-marker">
                            <span className="icon">
                              <i className="fa fa-edit"></i>
                            </span>
                          </div>
                          <div className="step-details">
                            <p className="step-title">Setup Profile</p>
                            <p>Complete your profile information</p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="step-item is-completed is-warning">
                          <div className="step-marker">
                            <span className="icon">
                              <i className="fa fa-feather-alt"></i>
                            </span>
                          </div>
                          <div className="step-details">
                            <p className="step-title">First Quack</p>
                            <p>Start creating your first "Quack"</p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="step-item is-completed is-primary">
                          <div className="step-marker">
                            <span className="icon">
                              <i className="fa fa-users"></i>
                            </span>
                          </div>
                          <div className="step-details">
                            <p className="step-title">Connect</p>
                            <p>Follow other users and engage with their content</p>
                          </div>
                        </div>

                        {/* Step 5 */}
                        <div className="step-item is-completed is-danger">
                          <div className="step-marker">
                            <span className="icon">
                              <i className="fa fa-rocket"></i>
                            </span>
                          </div>
                          <div className="step-details">
                            <p className="step-title">Explore</p>
                            <p>Explore and have fun!</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="notification is-info is-light">
                    <p className="has-text-centered">
                      <strong>🚀 Ready to get started?</strong><br/>
                      Join the QuackBook community today and start sharing your story!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}