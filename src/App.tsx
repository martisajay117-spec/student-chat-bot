/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBanner } from './components/TopBanner';
import { JarvisAssistantCard } from './components/JarvisAssistantCard';
import { InteractiveMapCard } from './components/InteractiveMapCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { BottomFeatureStrip } from './components/BottomFeatureStrip';
import { BottomTabBar, MobileTabId } from './components/BottomTabBar';
import { VoiceChatModal } from './components/VoiceChatModal';
import { QuickActionModal } from './components/QuickActionModal';
import { FullMapModal } from './components/FullMapModal';
import { AskJarvisChatView } from './components/AskJarvisChatView';
import { CampusMapView } from './components/CampusMapView';
import { ImportantDatesView } from './components/ImportantDatesView';
import { NavItemId, SuggestionQuestion, QuickActionItem } from './types';
import { QUICK_ACTIONS } from './data/campusData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItemId>('home');
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTabId>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Modals and interactive states
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<QuickActionItem | null>(null);
  const [pendingChatQuery, setPendingChatQuery] = useState<string>('');

  const handleVoiceSwitchToText = (query?: string) => {
    setIsVoiceModalOpen(false);
    setActiveTab('ask-jarvis');
    setMobileActiveTab('ask-jarvis');
    if (query) {
      setPendingChatQuery(query);
    }
  };

  const handleSelectTab = (tab: NavItemId) => {
    setActiveTab(tab);
    if (tab === 'ask-jarvis') {
      setMobileActiveTab('ask-jarvis');
    } else if (tab === 'campus-map') {
      setMobileActiveTab('map');
    } else if (tab === 'fee-payments') {
      setSelectedQuickAction(QUICK_ACTIONS[1]);
    } else if (tab === 'important-dates') {
      setMobileActiveTab('dates');
      setActiveTab('important-dates');
    } else if (tab === 'home') {
      setMobileActiveTab('home');
    }
  };

  const handleMobileTabSelect = (tab: MobileTabId) => {
    setMobileActiveTab(tab);
    if (tab === 'home') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'ask-jarvis') {
      setActiveTab('ask-jarvis');
    } else if (tab === 'map') {
      setActiveTab('campus-map');
    } else if (tab === 'dates') {
      setActiveTab('important-dates');
    } else if (tab === 'more') {
      setIsMobileMenuOpen(true);
    }
  };

  const handleSelectSuggestion = (suggestion: SuggestionQuestion) => {
    // When a suggestion chip is clicked, user can continue in Ask Jarvis chat
    console.log('Selected suggestion:', suggestion.question);
    setPendingChatQuery(suggestion.question);
    setActiveTab('ask-jarvis');
    setMobileActiveTab('ask-jarvis');
  };

  const handleAskJarvisFromModal = (query: string) => {
    setSelectedQuickAction(null);
    setPendingChatQuery(query);
    setActiveTab('ask-jarvis');
    setMobileActiveTab('ask-jarvis');
  };

  // If user navigated to Ask Jarvis chat page
  const isChatView = mobileActiveTab === 'ask-jarvis' || activeTab === 'ask-jarvis';
  // If user navigated to Campus Map page
  const isMapView = mobileActiveTab === 'map' || activeTab === 'campus-map';
  // If user navigated to Important Dates page
  const isDatesView = mobileActiveTab === 'dates' || activeTab === 'important-dates';

  if (isDatesView) {
    return (
      <div className="min-h-screen bg-[#F0F4F9] flex flex-col text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
        {/* Dedicated Full-Screen Important Dates View */}
        <div className="flex-1 min-h-screen flex flex-col w-full max-w-2xl mx-auto shadow-sm sm:border-x sm:border-slate-200/60 bg-[#F0F4F9]">
          <ImportantDatesView
            onBackToHome={() => {
              setActiveTab('home');
              setMobileActiveTab('home');
            }}
            onSelectMobileTab={handleMobileTabSelect}
            onAskJarvisAboutDate={(query) => {
              setPendingChatQuery(query);
              setActiveTab('ask-jarvis');
              setMobileActiveTab('ask-jarvis');
            }}
          />
        </div>

        {/* Modals when triggered */}
        <VoiceChatModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onSpokenQuery={(query) => {
            console.log('Spoken:', query);
          }}
          onSwitchToText={handleVoiceSwitchToText}
        />

        <QuickActionModal
          action={selectedQuickAction}
          onClose={() => setSelectedQuickAction(null)}
          onAskJarvis={handleAskJarvisFromModal}
        />
      </div>
    );
  }

  if (isMapView) {
    return (
      <div className="min-h-screen bg-[#0B1D3A] flex flex-col text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
        {/* Dedicated Full-Screen Campus Map View */}
        <div className="flex-1 min-h-screen flex flex-col w-full max-w-2xl mx-auto shadow-2xl sm:border-x sm:border-slate-800/80 bg-[#0B1D3A]">
          <CampusMapView
            onBackToHome={() => {
              setActiveTab('home');
              setMobileActiveTab('home');
            }}
            onSelectMobileTab={handleMobileTabSelect}
            onAskJarvisAboutLocation={(query) => {
              setPendingChatQuery(query);
              setActiveTab('ask-jarvis');
              setMobileActiveTab('ask-jarvis');
            }}
          />
        </div>

        {/* Modals when triggered */}
        <VoiceChatModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onSpokenQuery={(query) => {
            console.log('Spoken:', query);
          }}
          onSwitchToText={handleVoiceSwitchToText}
        />

        <QuickActionModal
          action={selectedQuickAction}
          onClose={() => setSelectedQuickAction(null)}
          onAskJarvis={handleAskJarvisFromModal}
        />
      </div>
    );
  }

  if (isChatView) {
    return (
      <div className="min-h-screen bg-[#F0F4F9] flex flex-col text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
        {/* Dedicated Full-Screen Chat View */}
        <div className="flex-1 min-h-screen flex flex-col w-full max-w-2xl mx-auto shadow-sm sm:border-x sm:border-slate-200/60 bg-[#F0F4F9]">
          <AskJarvisChatView
            onBackToHome={() => {
              setActiveTab('home');
              setMobileActiveTab('home');
            }}
            onOpenMap={() => handleMobileTabSelect('map')}
            onOpenDates={() => handleMobileTabSelect('dates')}
            onOpenMore={() => {
              setActiveTab('home');
              setMobileActiveTab('home');
            }}
            onSelectMobileTab={handleMobileTabSelect}
            onStartVoice={() => setIsVoiceModalOpen(true)}
            pendingQuery={pendingChatQuery}
            onClearPendingQuery={() => setPendingChatQuery('')}
          />
        </div>

        {/* Modals when triggered from within chat */}
        <VoiceChatModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onSpokenQuery={(query) => {
            console.log('Spoken:', query);
          }}
          onSwitchToText={handleVoiceSwitchToText}
        />

        <FullMapModal
          isOpen={isFullMapOpen}
          onClose={() => setIsFullMapOpen(false)}
        />

        <QuickActionModal
          action={selectedQuickAction}
          onClose={() => setSelectedQuickAction(null)}
          onAskJarvis={handleAskJarvisFromModal}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Fixed Sidebar on Left (Desktop) & Slide-over Drawer (Mobile) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (Spans right of sidebar on lg screens) */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-3 sm:p-5 lg:p-7 pb-24 lg:pb-7 max-w-[1680px] transition-all">
        {/* Top Banner (Full Width, responsive for mobile & desktop) */}
        <TopBanner
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />

        {/* Main Content Grid: 3 Columns below the banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6 flex-1 items-stretch">
          {/* Column 1: Jarvis Assistant Card (xl:col-span-4) - Primary Focus matching reference */}
          <div className="xl:col-span-4 flex flex-col">
            <JarvisAssistantCard
              onSelectSuggestion={handleSelectSuggestion}
              onStartVoice={() => setIsVoiceModalOpen(true)}
            />
          </div>

          {/* Column 2: Your Route / Interactive Map Card (xl:col-span-5) */}
          <div className="xl:col-span-5 flex flex-col">
            <InteractiveMapCard
              onOpenFullMap={() => handleMobileTabSelect('map')}
            />
          </div>

          {/* Column 3: Quick Actions + Need More Help (xl:col-span-3) */}
          <div className="md:col-span-2 xl:col-span-3 flex flex-col">
            <QuickActionsCard
              onSelectAction={(action) => setSelectedQuickAction(action)}
              onStartVoice={() => setIsVoiceModalOpen(true)}
            />
          </div>
        </div>

        {/* Bottom Feature Strip (4 columns across full width) */}
        <BottomFeatureStrip />

        {/* Fixed Mobile Bottom Tab Bar (5 icons: Home, Ask Jarvis, Map, Dates, More) */}
        <BottomTabBar
          activeTab={mobileActiveTab}
          onSelectTab={handleMobileTabSelect}
        />

        {/* Interactive Modals */}
        <VoiceChatModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setMobileActiveTab('home');
          }}
          onSpokenQuery={(query) => console.log('Spoken:', query)}
          onSwitchToText={handleVoiceSwitchToText}
        />

        <QuickActionModal
          action={selectedQuickAction}
          onClose={() => {
            setSelectedQuickAction(null);
            setMobileActiveTab('home');
          }}
          onAskJarvis={handleAskJarvisFromModal}
        />

        <FullMapModal
          isOpen={isFullMapOpen}
          onClose={() => {
            setIsFullMapOpen(false);
            setMobileActiveTab('home');
          }}
        />
      </main>
    </div>
  );
}

