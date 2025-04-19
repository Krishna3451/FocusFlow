import React from 'react';
import { Link } from 'react-router-dom';
import OwlAvatar from '../components/shared/OwlAvatar';

const Index = () => {
  return (
    <div className="min-h-screen owl-gradient flex flex-col">
      <header className="py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <OwlAvatar size="sm" />
              <span className="text-owl-navy font-semibold text-lg">Wise Owl Coach</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 animate-subtle-bounce">
              <OwlAvatar size="lg" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-owl-navy mb-6 animate-fade-in">
              Your Mental Wellness Journey Begins Here
            </h1>
            
            <p className="text-xl text-owl-navy/80 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
              A safe space for reflection, growth, and emotional well-being with personalized AI therapy support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Link 
                to="/mentor" 
                className="bg-owl-blue hover:bg-owl-blue/80 text-owl-navy px-8 py-3 rounded-full font-medium transition-colors shadow-sm hover:shadow"
              >
                Start Therapy Session
              </Link>
              
              <Link 
                to="/today" 
                className="bg-white hover:bg-owl-grey/50 text-owl-navy px-8 py-3 rounded-full font-medium transition-colors shadow-sm hover:shadow"
              >
                Daily Reflection
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-owl-navy text-center mb-12">Your Path to Mental Well-being</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-owl-blue/10 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-owl-blue/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-owl-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-owl-navy mb-3">AI Therapy Support</h3>
              <p className="text-owl-navy/70">
                Engage in meaningful conversations with our AI therapist for guidance and emotional support.
              </p>
            </div>
            
            <div className="bg-owl-mint/10 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-owl-mint/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-owl-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-owl-navy mb-3">Daily Reflections</h3>
              <p className="text-owl-navy/70">
                Document your journey, track your emotional well-being, and celebrate daily wins through guided journaling.
              </p>
            </div>
            
            <div className="bg-owl-yellow/10 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-owl-yellow/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-owl-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-owl-navy mb-3">Growth Journey</h3>
              <p className="text-owl-navy/70">
                Track your emotional progress and personal growth with insightful visualizations of your wellness journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-owl-navy py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <OwlAvatar size="sm" />
              <span className="text-white font-semibold">Wise Owl Coach</span>
            </div>
            
            <div className="text-white/70 text-sm">
              © 2025 Wise Owl Coach. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
