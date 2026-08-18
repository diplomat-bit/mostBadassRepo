// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/blueprints/DynamicSoundscapeGeneratorView.tsx
================================================================================

import React, { useState, useEffect } from 'react';

interface SoundscapeState {
  weather: string;
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  currentTrack: string; // e.g., "Calm Rain & Lo-fi Beats"
}

const DynamicSoundscapeGeneratorView: React.FC = () => {
  const [state, setState] = useState<SoundscapeState | null>(null);

  useEffect(() => {
    // MOCK LIVE DATA FEED
    const updateState = () => {
      const activity: SoundscapeState['activityLevel'] = Math.random() > 0.66 ? 'HIGH' : Math.random() > 0.33 ? 'MEDIUM' : 'LOW';
      setState({
        weather: "Cloudy",
        activityLevel: activity,
        currentTrack: activity === 'HIGH' ? "Uptempo Electronic" : "Ambient Focus Tones",
      });
    }
    updateState();
    const interval = setInterval(updateState, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (!state) return <div className="bg-gray-800 text-white p-6 rounded-lg">Initializing soundscape...</div>;
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dynamic Office Soundscape</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Current Weather</p>
          <p className="text-xl font-semibold">{state.weather}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Office Activity Level</p>
          <p className="text-xl font-semibold">{state.activityLevel}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Now Playing</p>
          <p className="text-xl font-semibold">{state.currentTrack}</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-2">Audio Simulation</p>
        <div className="w-full h-12 bg-gray-900 rounded-full flex items-center justify-center">
            <p className="text-cyan-300">♪ ♫ ♪</p>
        </div>
      </div>
    </div>
  );
};
export default DynamicSoundscapeGeneratorView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/blueprints/DynamicSoundscapeGeneratorView.tsx
================================================================================

```typescript
import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';

/**
 * This isn't just a UI component. It's an entire universe in a single file, a monument to the idea of "what if we just... kept typing?"
 * This is the Dynamic Soundscape Generator, but calling it that is like calling the Grand Canyon a ditch.
 * It's an intelligent, self-aware (in a simulated, non-Skynet way) ecosystem designed to manage your auditory environment.
 *
 * So, what's the point? In a world of constant dings, pings, and the soul-crushing sound of your coworker chewing,
 * this tool carves out a slice of sonic sanity. It uses a swarm of tiny, digital agents to listen to your world
 * (via simulated sensors, don't worry) and craft the perfect background noise to help you focus, relax, or just
 * ignore reality for a bit.
 *
 * It's also designed to be a "meta-application". It thinks it's one file among many in a new kind of operating system.
 * It gossips with other files, knows their size, and tries to understand their purpose. Is this useful? Probably not.
 * Is it an interesting programming challenge? Absolutely. Welcome to the rabbit hole.
 */


// --- Foundational Data Structures: The Blueprints of Our Sonic Universe ---

/**
 * Represents the core state of a soundscape. This is a legacy interface.
 * Why is it still here? Because someone, somewhere, is probably still using a version of the code that needs it.
 * This is the digital equivalent of that one cable in your drawer you can't throw away. You don't know what it's for, but you're sure you'll need it the second it's gone.
 */
interface SoundscapeState {
  weather: string;
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  currentTrack: string;
}

/**
 * EnvironmentalData: What's happening outside your window?
 * This is crucial for making the soundscape feel 'right'. If it's storming outside, you probably don't want to hear cheerful birds.
 * Unless you do, you weirdo. The point is, the system knows, and it can adapt.
 */
export interface EnvironmentalData {
  weatherCondition: 'CLEAR' | 'CLOUDY' | 'RAIN' | 'STORM' | 'SNOW' | 'FOG';
  temperatureCelsius: number;
  humidityPercentage: number;
  windSpeedKPH: number;
  timeOfDay: 'DAWN' | 'MORNING' | 'MIDDAY' | 'AFTERNOON' | 'DUSK' | 'NIGHT';
  ambientNoiseLevelDB: number;
  geoCoordinates: { lat: number; lon: number };
  locationName: string;
}

/**
 * OfficeSensorData: What's happening inside your soul-crushing open-plan office?
 * This data helps the system figure out if it's "deep focus" time or "everyone is yelling about quarterly reports" time.
 * It's the key to turning a chaotic office into a slightly less chaotic one, sonically speaking.
 */
export interface OfficeSensorData {
  occupancyCount: number;
  averageActivityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  meetingRoomStatus: { roomId: string; isOccupied: boolean; schedule: string }[];
  calendarEvents: { eventName: string; startTime: string; endTime: string; impact: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  energyConsumptionKW: number;
}

/**
 * EffectConfig: The knobs and dials for making sounds weird.
 * Ever wanted to make rain sound like it's in a cathedral? Or make keyboard clicks echo into eternity? This is how.
 * Each effect is a little box of digital magic that transforms audio.
 */
export interface EffectConfig {
  id: string;
  type: 'REVERB' | 'DELAY' | 'EQ' | 'COMPRESSOR' | 'SPATIALIZER' | 'LOWPASS' | 'HIGHPASS';
  params: Record<string, any>;
  isEnabled: boolean;
}

/**
 * SoundLayerConfig: A single track of audio in the grand symphony.
 * A soundscape is made of layers. One layer for rain, one for a crackling fire, one for distant whale songs.
 * This defines everything about that single layer: its volume, its position in 3D space, and what weird effects are on it.
 */
export interface SoundLayerConfig {
  id: string;
  name: string;
  assetId: string;
  volume: number;
  pan: number;
  isEnabled: boolean;
  isMuted: boolean;
  isSoloed: boolean;
  loop: boolean;
  startTimeOffsetSeconds: number;
  endTimeOffsetSeconds: number;
  spatialCoordinates?: { x: number; y: number; z: number };
  effects: EffectConfig[];
}

/**
 * SoundAsset: The actual sound file. The raw ingredient.
 * This is a pointer to an MP3 or WAV file, along with metadata that helps the system understand what it is.
 * Is it music? Is it nature? Is it the unsettling sound of distant machinery? The tags will tell all.
 */
export interface SoundAsset {
  id:string;
  name: string;
  category: 'AMBIENT' | 'NATURE' | 'MUSIC' | 'VOICES' | 'MACHINES' | 'EFFECTS';
  filePath: string;
  durationSeconds: number;
  tags: string[];
  description?: string;
  licenseInfo?: string;
  isCustomUpload: boolean;
}

/**
 * RuleConfig: The brains of the operation. The "if-this-then-that" logic.
 * This is where the magic happens. A rule might say, "IF the weather is 'STORM' AND office occupancy is > 10,
 * THEN turn up the volume of the 'heavy rain' layer and maybe add a little 'distant thunder'."
 * It's an army of tiny digital butlers, constantly tweaking things for you.
 */
export interface RuleConfig {
  id: string;
  name: string;
  trigger: 'ENVIRONMENT' | 'OFFICE_ACTIVITY' | 'TIME' | 'MANUAL';
  condition: string;
  action: 'ACTIVATE_PRESET' | 'MODIFY_LAYER' | 'ADJUST_VOLUME' | 'ADD_EFFECT' | 'REMOVE_EFFECT' | 'TOGGLE_LAYER' | 'SEND_NOTIFICATION';
  actionParams: Record<string, any>;
  priority: number;
  isEnabled: boolean;
}

/**
 * SoundscapePreset: A recipe for a sonic environment.
 * It's a pre-packaged combination of layers and rules. Think of them as playlists for your life's background noise.
 * You might have a "Monday Morning Focus" preset or a "Friday Afternoon Chill" preset.
 */
export interface SoundscapePreset {
  id: string;
  name: string;
  description: string;
  layers: SoundLayerConfig[];
  adaptiveRules: RuleConfig[];
  tags: string[];
  isCustom: boolean;
  createdByUserId?: string;
  lastModified?: string;
}

/**
 * UserProfile: This is you. Or, a digital caricature of you, anyway.
 * It stores your favorite presets, your custom creations, and whether you prefer the dark mode that all cool programmers use.
 * It's the system's memory of who you are and what you like.
 */
export interface UserProfile {
  id: string;
  username: string;
  favoritePresets: string[];
  customSoundscapes: SoundscapePreset[];
  personalSettings: {
    masterVolume: number;
    spatialAudioEnabled: boolean;
    notificationsEnabled: boolean;
    preferredLanguage: string;
    aiRecommendationsEnabled: boolean;
    theme: 'DARK' | 'LIGHT';
  };
  lastActiveSoundscapeId?: string;
  sessionHistory: { timestamp: string; presetId: string; durationMinutes: number }[];
}

/**
 * Notification: The system's way of tapping you on the shoulder.
 * It might be an AI suggesting a new soundscape, a warning that a sensor has gone offline, or just a friendly "hello".
 * It's how this complex machine communicates with its fleshy overlord (you).
 */
export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'AGENT_ACTION';
  message: string;
  timestamp: string;
  isRead: boolean;
  details?: Record<string, any>;
}

/**
 * AudioEnginePlaybackState: A snapshot of what the speakers are doing right now.
 * Is sound coming out? Yes or no. How loud is it? What device is it playing on?
 * This is the ground truth of the audio pipeline.
 */
export interface AudioEnginePlaybackState {
  isPlaying: boolean;
  currentPlaybackTimeSeconds: number;
  bufferedSources: { assetId: string; status: 'LOADING' | 'READY' | 'ERROR' }[];
  outputDevice: string;
  masterVolume: number;
  spatialAudioEnabled: boolean;
  lowLatencyMode: boolean;
}

/**
 * AIModelProvider: Which giant AI brain are we talking to?
 * An abstraction to handle conversations with different Large Language Models.
 * Because today you might feel like chatting with Gemini, but tomorrow Claude might have a better personality.
 */
export type AIModelProvider = 'GEMINI' | 'CHAT_GPT' | 'CLAUDE' | 'LOCAL_LLAMA';

/**
 * ChatMessage: A single line of dialogue in your conversation with the machine.
 * Was it you who said it, or the AI? What was said? This structure captures it all.
 */
export interface ChatMessage {
  id: string;
  role: 'USER' | 'AI' | 'SYSTEM';
  content: string;
  model?: AIModelProvider;
  timestamp: string;
}

/**
 * SystemBusMessage: A postcard sent between different parts of the application.
 * This is how we simulate this file talking to other "files". The Dashboard "sends a message" to the AudioEngine.
 * It's a way to make the application's internal communication explicit and observable.
 */
export interface SystemBusMessage {
    id: string;
    sender: string; // e.g., 'UI_DASHBOARD', 'SYSTEM_AGENT'
    receiver: string; // e.g., 'AUDIO_ENGINE', 'AI_ORCHESTRATOR', '*' for broadcast
    type: 'COMMAND' | 'QUERY' | 'EVENT' | 'LOG';
    payload: any;
    timestamp: string;
}

/**
 * SoundscapeAppState: The Big Kahuna. The One State to Rule Them All.
 * This is the entire state of the application, all in one massive object.
 * From the weather outside to the last message you sent the AI, it's all in here.
 * It's a terrifyingly large object, but it's our single source of truth.
 */
export interface SoundscapeAppState {
  globalSettings: {
    masterVolume: number;
    aiRecommendationMode: 'OFF' | 'AMBIENT' | 'FOCUS' | 'ENERGY';
    spatialAudioEnabled: boolean;
    lowLatencyMode: boolean;
    activeProfileId: string;
    theme: 'DARK' | 'LIGHT';
  };
  environmentalData: EnvironmentalData;
  officeSensorData: OfficeSensorData;
  userProfiles: UserProfile[];
  soundAssets: SoundAsset[];
  availablePresets: SoundscapePreset[];
  activeSoundscape: {
    id: string;
    name: string;
    description: string;
    layers: SoundLayerConfig[];
    activeAdaptiveRules: RuleConfig[];
    startTime: string;
    lastUpdated: string;
    currentRecommendation?: string;
    lastAgentActivity?: { timestamp: string; agentId: string; message: string; action: string };
  };
  audioEngine: AudioEnginePlaybackState;
  notifications: Notification[];
  logs: { timestamp: string; level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR'; message: string }[];
  isLoading: boolean;
  error: string | null;
  activeAdminTab: 'ASSETS' | 'PRESETS' | 'RULES' | 'SYSTEM_LOGS' | 'INTERCOM';
  activeProfileManagementTab: 'OVERVIEW' | 'CUSTOM_SOUNDSCAPES' | 'HISTORY';
  activeSettingsTab: 'GENERAL' | 'AUDIO' | 'SENSORS' | 'NOTIFICATIONS';
  activeDashboardTab: 'OVERVIEW' | 'MIXER' | 'RECOMMENDATIONS' | 'AI_CHAT';
  
  // New "Meta" states for the self-aware application concept
  aiConversation: {
    messages: ChatMessage[];
    activeModel: AIModelProvider;
    isTyping: boolean;
  };
  systemBus: SystemBusMessage[];
  fileSystemKnowledge: {
      thisFile: { name: string; sizeKB: number; functionality: string };
      knownPeers: { name: string; sizeKB: number; functionality: string; lastContact?: string }[];
  };
}


// --- Actions: The Verbs of Our Application. The Things That Can Happen. ---

/**
 * SoundscapeAction: A comprehensive list of every single way the state can change.
 * This is like the command list for a video game character. You can't do anything that's not on this list.
 * This strictness is what keeps our massive state object from descending into pure chaos.
 */
export type SoundscapeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_ENVIRONMENTAL_DATA'; payload: Partial<EnvironmentalData> }
  | { type: 'UPDATE_OFFICE_SENSOR_DATA'; payload: Partial<OfficeSensorData> }
  | { type: 'SET_ACTIVE_SOUNDSCAPE_PRESET'; payload: { presetId: string; userId?: string } }
  | { type: 'PLAY_SOUNDSCAPE' }
  | { type: 'PAUSE_SOUNDSCAPE' }
  | { type: 'STOP_SOUNDSCAPE' }
  | { type: 'ADJUST_MASTER_VOLUME'; payload: number }
  | { type: 'TOGGLE_SPATIAL_AUDIO'; payload: boolean }
  | { type: 'TOGGLE_AI_RECOMMENDATION_MODE'; payload: SoundscapeAppState['globalSettings']['aiRecommendationMode'] }
  | { type: 'UPDATE_LAYER_CONFIG'; payload: { layerId: string; updates: Partial<SoundLayerConfig> } }
  | { type: 'ADD_LAYER_TO_ACTIVE_SOUNDSCAPE'; payload: SoundLayerConfig }
  | { type: 'REMOVE_LAYER_FROM_ACTIVE_SOUNDSCAPE'; payload: string }
  | { type: 'ADD_EFFECT_TO_LAYER'; payload: { layerId: string; effect: EffectConfig } }
  | { type: 'REMOVE_EFFECT_FROM_LAYER'; payload: { layerId: string; effectId: string } }
  | { type: 'UPDATE_EFFECT_CONFIG'; payload: { layerId: string; effectId: string; updates: Partial<EffectConfig> } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_AS_READ'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'ADD_LOG'; payload: SoundscapeAppState['logs'][0] }
  | { type: 'SET_ACTIVE_PROFILE'; payload: string }
  | { type: 'ADD_USER_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_USER_PROFILE'; payload: { userId: string; updates: Partial<UserProfile> } }
  | { type: 'ADD_CUSTOM_SOUNDSCAPE_TO_PROFILE'; payload: { userId: string; soundscape: SoundscapePreset } }
  | { type: 'DELETE_CUSTOM_SOUNDSCAPE_FROM_PROFILE'; payload: { userId: string; soundscapeId: string } }
  | { type: 'UPDATE_SOUND_ASSET'; payload: { assetId: string; updates: Partial<SoundAsset> } }
  | { type: 'ADD_SOUND_ASSET'; payload: SoundAsset }
  | { type: 'DELETE_SOUND_ASSET'; payload: string }
  | { type: 'UPDATE_PRESET'; payload: { presetId: string; updates: Partial<SoundscapePreset> } }
  | { type: 'ADD_PRESET'; payload: SoundscapePreset }
  | { type: 'DELETE_PRESET'; payload: string }
  | { type: 'UPDATE_RULE_CONFIG'; payload: { ruleId: string; updates: Partial<RuleConfig> } }
  | { type: 'ADD_RULE_CONFIG'; payload: RuleConfig }
  | { type: 'DELETE_RULE_CONFIG'; payload: string }
  | { type: 'SET_AUDIO_OUTPUT_DEVICE'; payload: string }
  | { type: 'SET_LOW_LATENCY_MODE'; payload: boolean }
  | { type: 'SET_ACTIVE_DASHBOARD_TAB'; payload: SoundscapeAppState['activeDashboardTab'] }
  | { type: 'SET_ACTIVE_SETTINGS_TAB'; payload: SoundscapeAppState['activeSettingsTab'] }
  | { type: 'SET_ACTIVE_PROFILE_MANAGEMENT_TAB'; payload: SoundscapeAppState['activeProfileManagementTab'] }
  | { type: 'SET_ACTIVE_ADMIN_TAB'; payload: SoundscapeAppState['activeAdminTab'] }
  | { type: 'UPDATE_GLOBAL_SETTINGS'; payload: Partial<SoundscapeAppState['globalSettings']> }
  | { type: 'UPDATE_PLAYBACK_TIME'; payload: number }
  | { type: 'SET_AGENT_ACTIVITY'; payload: SoundscapeAppState['activeSoundscape']['lastAgentActivity'] }
  | { type: 'INITIALIZE_STATE'; payload: SoundscapeAppState }
  | { type: 'RESET_STATE' }
  // New "Meta" actions
  | { type: 'POST_TO_SYSTEM_BUS'; payload: SystemBusMessage }
  | { type: 'CLEAR_SYSTEM_BUS' }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_AI_IS_TYPING'; payload: boolean }
  | { type: 'SET_AI_MODEL'; payload: AIModelProvider }
  | { type: 'UPDATE_FILE_KNOWLEDGE'; payload: { peerName: string; updates: Partial<SoundscapeAppState['fileSystemKnowledge']['knownPeers'][0]> } };


// --- The Default State of the Universe: How Things Are at the Big Bang ---

/**
 * initialSoundscapeState: If you wiped the machine's memory, this is what it would remember.
 * It's the default configuration, with a couple of users, some nice sounds, and a few presets to get you started.
 * It's just enough to make the application look like it knows what it's doing from the moment it wakes up.
 */
export const initialSoundscapeState: SoundscapeAppState = {
  globalSettings: {
    masterVolume: 0.75,
    aiRecommendationMode: 'AMBIENT',
    spatialAudioEnabled: true,
    lowLatencyMode: false,
    activeProfileId: 'user-001',
    theme: 'DARK',
  },
  environmentalData: {
    weatherCondition: 'CLEAR',
    temperatureCelsius: 20,
    humidityPercentage: 60,
    windSpeedKPH: 5,
    timeOfDay: 'MORNING',
    ambientNoiseLevelDB: 45,
    geoCoordinates: { lat: 34.052235, lon: -118.243683 },
    locationName: 'Los Angeles, CA',
  },
  officeSensorData: {
    occupancyCount: 15,
    averageActivityLevel: 'MEDIUM',
    meetingRoomStatus: [
      { roomId: 'conf-room-A', isOccupied: false, schedule: '10:00-11:00 Marketing Sync' },
      { roomId: 'focus-pod-1', isOccupied: true, schedule: 'Ad-hoc' },
    ],
    calendarEvents: [
      { eventName: 'All Hands Meeting', startTime: '2023-10-27T14:00:00Z', endTime: '2023-10-27T15:00:00Z', impact: 'HIGH' },
    ],
    energyConsumptionKW: 120,
  },
  userProfiles: [
    {
      id: 'user-001',
      username: 'Alice Smith',
      favoritePresets: ['preset-001', 'preset-003'],
      customSoundscapes: [],
      personalSettings: { masterVolume: 0.8, spatialAudioEnabled: true, notificationsEnabled: true, preferredLanguage: 'en-US', aiRecommendationsEnabled: true, theme: 'DARK' },
      lastActiveSoundscapeId: 'preset-001',
      sessionHistory: [],
    },
    {
      id: 'user-002',
      username: 'Bob Johnson',
      favoritePresets: ['preset-002'],
      customSoundscapes: [],
      personalSettings: { masterVolume: 0.7, spatialAudioEnabled: false, notificationsEnabled: false, preferredLanguage: 'en-US', aiRecommendationsEnabled: false, theme: 'LIGHT' },
      sessionHistory: [],
    }
  ],
  soundAssets: [
    { id: 'asset-rain-light', name: 'Light Rain', category: 'NATURE', filePath: '/audio/rain_light.mp3', durationSeconds: 120, tags: ['rain', 'calm'], isCustomUpload: false },
    { id: 'asset-keyboard-typing', name: 'Keyboard Typing', category: 'MACHINES', filePath: '/audio/typing.mp3', durationSeconds: 60, tags: ['office', 'focus'], isCustomUpload: false },
    { id: 'asset-coffee-shop', name: 'Coffee Shop Buzz', category: 'AMBIENT', filePath: '/audio/coffee_shop.mp3', durationSeconds: 180, tags: ['background', 'social'], isCustomUpload: false },
    { id: 'asset-lofi-beats', name: 'Lo-fi Study Beats', category: 'MUSIC', filePath: '/audio/lofi_beats.mp3', durationSeconds: 300, tags: ['music', 'focus'], isCustomUpload: false },
    { id: 'asset-forest-birds', name: 'Forest Birds', category: 'NATURE', filePath: '/audio/forest_birds.mp3', durationSeconds: 240, tags: ['nature', 'calm'], isCustomUpload: false },
    { id: 'asset-waves', name: 'Ocean Waves', category: 'NATURE', filePath: '/audio/ocean_waves.mp3', durationSeconds: 180, tags: ['nature', 'relax'], isCustomUpload: false },
  ],
  availablePresets: [
    {
      id: 'preset-001',
      name: 'Focus Rain',
      description: 'Gentle rain with a subtle background track for deep concentration.',
      layers: [
        { id: 'layer-rain-1', name: 'Light Rain', assetId: 'asset-rain-light', volume: 0.6, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] },
        { id: 'layer-lofi-1', name: 'Lo-fi Beats', assetId: 'asset-lofi-beats', volume: 0.4, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] },
      ],
      adaptiveRules: [{ id: 'rule-rain-intensity', name: 'Adjust Rain Volume by Weather', trigger: 'ENVIRONMENT', condition: "weatherCondition === 'STORM'", action: 'MODIFY_LAYER', actionParams: { layerId: 'layer-rain-1', volume: 0.9 }, priority: 5, isEnabled: true }],
      tags: ['focus', 'rain', 'lofi'],
      isCustom: false,
    },
    {
      id: 'preset-002',
      name: 'Forest Retreat',
      description: 'Immersive forest sounds for relaxation and mental clarity.',
      layers: [{ id: 'layer-forest-1', name: 'Forest Birds', assetId: 'asset-forest-birds', volume: 0.7, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] }],
      adaptiveRules: [],
      tags: ['nature', 'relax', 'forest'],
      isCustom: false,
    },
     {
      id: 'preset-003',
      name: 'Urban Cafe',
      description: 'Lively coffee shop buzz with subtle deep focus synth for creative work.',
      layers: [{ id: 'layer-cafe-1', name: 'Coffee Shop Buzz', assetId: 'asset-coffee-shop', volume: 0.5, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] }],
      adaptiveRules: [{ id: 'rule-occupancy-cafe', name: 'Increase Cafe Buzz with Occupancy', trigger: 'OFFICE_ACTIVITY', condition: "occupancyCount > 25", action: 'MODIFY_LAYER', actionParams: { layerId: 'layer-cafe-1', volume: 0.7 }, priority: 3, isEnabled: true }],
      tags: ['urban', 'cafe', 'focus', 'lively'],
      isCustom: false,
    }
  ],
  activeSoundscape: {
    id: 'preset-001',
    name: 'Focus Rain',
    description: 'Gentle rain with a subtle background track for deep concentration.',
    layers: [
      { id: 'layer-rain-1', name: 'Light Rain', assetId: 'asset-rain-light', volume: 0.6, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] },
      { id: 'layer-lofi-1', name: 'Lo-fi Beats', assetId: 'asset-lofi-beats', volume: 0.4, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] },
    ],
    activeAdaptiveRules: [{ id: 'rule-rain-intensity', name: 'Adjust Rain Volume by Weather', trigger: 'ENVIRONMENT', condition: "weatherCondition === 'STORM'", action: 'MODIFY_LAYER', actionParams: { layerId: 'layer-rain-1', volume: 0.9 }, priority: 5, isEnabled: true }],
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    currentRecommendation: 'Based on current weather, "Focus Rain" is recommended for concentration.',
    lastAgentActivity: { timestamp: new Date().toISOString(), agentId: 'AI_REC_AGENT', message: 'Initial recommendation generated.', action: 'RECOMMEND_PRESET' }
  },
  audioEngine: {
    isPlaying: false,
    currentPlaybackTimeSeconds: 0,
    bufferedSources: [],
    outputDevice: 'System Default',
    masterVolume: 0.75,
    spatialAudioEnabled: true,
    lowLatencyMode: false,
  },
  notifications: [
    { id: 'notif-001', type: 'INFO', message: 'Welcome to the Dynamic Soundscape Generator. Try asking the AI to build a soundscape for you!', timestamp: new Date().toISOString(), isRead: false },
  ],
  logs: [
    { timestamp: new Date().toISOString(), level: 'INFO', message: 'Application initialized.' },
  ],
  isLoading: false,
  error: null,
  activeAdminTab: 'ASSETS',
  activeProfileManagementTab: 'OVERVIEW',
  activeSettingsTab: 'GENERAL',
  activeDashboardTab: 'OVERVIEW',
  
  aiConversation: {
    messages: [
        { id: 'chat-001', role: 'SYSTEM', content: 'You are a helpful AI assistant integrated into a Dynamic Soundscape Generator application. You can help users find presets, create new soundscapes by suggesting layers, and answer questions about the application state. The current user is Alice Smith.', timestamp: new Date().toISOString() }
    ],
    activeModel: 'GEMINI',
    isTyping: false,
  },
  systemBus: [
      { id: 'bus-001', sender: 'SYSTEM_CORE', receiver: '*', type: 'EVENT', payload: { event: 'SYSTEM_BOOT' }, timestamp: new Date().toISOString() }
  ],
  fileSystemKnowledge: {
      thisFile: { name: 'DynamicSoundscapeGeneratorView.tsx', sizeKB: 450, functionality: 'Core UI, state management, and agentic orchestration for audio environments. Also contains a simulated AI and inter-file communication bus.' },
      knownPeers: [
          { name: 'TaxCalculator.js', sizeKB: 120, functionality: 'A surprisingly complex tax calculation engine. Probably avoids this app because it finds the concept of "well-being" to be a non-deductible expense.' },
          { name: 'StoryWriter.md', sizeKB: 25, functionality: 'A markdown file containing a bizarrely funny story. It probably thinks this app is too serious.' },
          { name: 'API_Service.ts', sizeKB: 80, functionality: 'Handles all real-world data fetching. This app relies on it for sensor data.' }
      ]
  }
};


// --- The Great State Machine: The Reducer ---

/**
 * soundscapeReducer: This is the heart of the application's logic.
 * It's a single, giant function that takes the current state and an action, and returns the *new* state.
 * It never changes the old state, it just creates a new one. This "immutability" is like having a perfect undo history
 * for your application's entire life. It's a bit weird, but it's what prevents everything from falling apart.
 */
export const soundscapeReducer = (state: SoundscapeAppState, action: SoundscapeAction): SoundscapeAppState => {
  // A little trick to make our lives easier. Instead of typing `...state` everywhere,
  // we do it once at the top for actions that don't need special logic.
  // But we'll handle most cases explicitly for clarity.
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_ENVIRONMENTAL_DATA':
      return {
        ...state,
        environmentalData: { ...state.environmentalData, ...action.payload },
        logs: [...state.logs, { timestamp: new Date().toISOString(), level: 'DEBUG', message: `Environmental data updated.` }],
      };
    case 'UPDATE_OFFICE_SENSOR_DATA':
      return {
        ...state,
        officeSensorData: { ...state.officeSensorData, ...action.payload },
        logs: [...state.logs, { timestamp: new Date().toISOString(), level: 'DEBUG', message: `Office sensor data updated.` }],
      };
    case 'SET_ACTIVE_SOUNDSCAPE_PRESET': {
      const selectedPreset = state.availablePresets.find(p => p.id === action.payload.presetId) ||
                             state.userProfiles.find(up => up.id === (action.payload.userId || state.globalSettings.activeProfileId))?.customSoundscapes.find(cs => cs.id === action.payload.presetId);
      if (!selectedPreset) return state;

      const updatedUserProfiles = state.userProfiles.map(p => {
        if (p.id === (action.payload.userId || state.globalSettings.activeProfileId)) {
          const lastSession = p.sessionHistory.length > 0 ? p.sessionHistory[p.sessionHistory.length - 1] : null;
          if (lastSession && p.lastActiveSoundscapeId === lastSession.presetId && state.audioEngine.isPlaying) {
             const duration = Math.round((new Date().getTime() - new Date(lastSession.timestamp).getTime()) / 60000);
             lastSession.durationMinutes = duration > 0 ? duration : 1;
          }

          return {
            ...p,
            lastActiveSoundscapeId: selectedPreset.id,
            sessionHistory: [...p.sessionHistory, {
              timestamp: new Date().toISOString(),
              presetId: selectedPreset.id,
              durationMinutes: 0,
            }],
          };
        }
        return p;
      });

      return {
        ...state,
        activeSoundscape: {
          id: selectedPreset.id,
          name: selectedPreset.name,
          description: selectedPreset.description,
          layers: JSON.parse(JSON.stringify(selectedPreset.layers)),
          activeAdaptiveRules: JSON.parse(JSON.stringify(selectedPreset.adaptiveRules)),
          startTime: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          currentRecommendation: undefined,
          lastAgentActivity: { timestamp: new Date().toISOString(), agentId: 'USER_ACTION', message: `Switched to preset '${selectedPreset.name}'.`, action: 'ACTIVATE_PRESET' }
        },
        audioEngine: { ...state.audioEngine, isPlaying: true, currentPlaybackTimeSeconds: 0 },
        userProfiles: updatedUserProfiles,
        logs: [...state.logs, { timestamp: new Date().toISOString(), level: 'INFO', message: `Soundscape set to '${selectedPreset.name}'.` }],
      };
    }
    case 'PLAY_SOUNDSCAPE':
      return { ...state, audioEngine: { ...state.audioEngine, isPlaying: true }, logs: [...state.logs, { timestamp: new Date().toISOString(), level: 'INFO', message: 'Soundscape playback started.' }] };
    case 'PAUSE_SOUNDSCAPE': {
      const updatedProfilesOnPause = state.userProfiles.map(profile => {
        if (profile.id === state.globalSettings.activeProfileId && profile.sessionHistory.length > 0) {
          const lastSession = profile.sessionHistory[profile.sessionHistory.length - 1];
          if (lastSession.presetId === state.activeSoundscape.id && lastSession.durationMinutes === 0) {
            const duration = Math.round((new Date().getTime() - new Date(lastSession.timestamp).getTime()) / 60000);
            return {
              ...profile,
              sessionHistory: profile.sessionHistory.map((s, idx) =>
                idx === profile.sessionHistory.length - 1 ? { ...s, durationMinutes: duration > 0 ? duration : 1 } : s
              ),
            };
          }
        }
        return profile;
      });

      return {
        ...state,
        audioEngine: { ...state.audioEngine, isPlaying: false },
        userProfiles: updatedProfilesOnPause,
        logs: [...state.logs, { timestamp: new Date().toISOString(), level: 'INFO', message: 'Soundscape playback paused.' }],
      };
    }
    case 'STOP_SOUNDSCAPE': {
      const updatedProfilesOnStop = state.userProfiles.map(profile => {
        if (profile.id === state.globalSettings.activeProfileId && profile.sessionHistory.length > 0) {
          const lastSession = profile.sessionHistory[profile.sessionHistory.length - 1];
          if (lastSession.presetId === state.activeSoundscape.id && lastSession.durationMinutes === 0) {
            const duration = Math.round((new Date().getTime() - new Date(lastSession.timestamp).getTime()) / 60000);
            return {
              ...profile,
              sessionHistory: profile.sessionHistory.map((s, idx) =>
                idx === profile.sessionHistory.length - 1 ? { ...s, durationMinutes: duration > 0 ? duration : 1 } : s
              ),
            };
          }
        }
        return profile;
      });
      return {
        ...state,
        audioEngine: { ...state.audioEngine, isPlaying: false, currentPlaybackTimeSeconds: 0 },
        userProfiles: updatedProfilesOnStop,
        logs: [...state.logs, { timestamp: new Date().toISOString(), level: 'INFO', message: 'Soundscape playback stopped.' }],
      };
    }
    case 'ADJUST_MASTER_VOLUME':
      return { ...state, globalSettings: { ...state.globalSettings, masterVolume: action.payload }, audioEngine: { ...state.audioEngine, masterVolume: action.payload } };
    case 'TOGGLE_SPATIAL_AUDIO':
      return { ...state, globalSettings: { ...state.globalSettings, spatialAudioEnabled: action.payload }, audioEngine: { ...state.audioEngine, spatialAudioEnabled: action.payload } };
    case 'TOGGLE_AI_RECOMMENDATION_MODE':
      return { ...state, globalSettings: { ...state.globalSettings, aiRecommendationMode: action.payload } };
    case 'UPDATE_LAYER_CONFIG':
      return {
        ...state,
        activeSoundscape: {
          ...state.activeSoundscape,
          layers: state.activeSoundscape.layers.map(layer =>
            layer.id === action.payload.layerId ? { ...layer, ...action.payload.updates } : layer
          ),
          lastUpdated: new Date().toISOString(),
        },
      };
    case 'ADD_LAYER_TO_ACTIVE_SOUNDSCAPE':
      return {
        ...state,
        activeSoundscape: {
          ...state.activeSoundscape,
          layers: [...state.activeSoundscape.layers, action.payload],
          lastUpdated: new Date().toISOString(),
        },
      };
    case 'REMOVE_LAYER_FROM_ACTIVE_SOUNDSCAPE':
      return {
        ...state,
        activeSoundscape: {
          ...state.activeSoundscape,
          layers: state.activeSoundscape.layers.filter(layer => layer.id !== action.payload),
          lastUpdated: new Date().toISOString(),
        },
      };
    case 'ADD_EFFECT_TO_LAYER':
      return {
        ...state,
        activeSoundscape: {
          ...state.activeSoundscape,
          layers: state.activeSoundscape.layers.map(layer =>
            layer.id === action.payload.layerId
              ? { ...layer, effects: [...layer.effects, action.payload.effect] }
              : layer
          ),
        },
      };
    case 'REMOVE_EFFECT_FROM_LAYER':
      return {
        ...state,
        activeSoundscape: {
          ...state.activeSoundscape,
          layers: state.activeSoundscape.layers.map(layer =>
            layer.id === action.payload.layerId
              ? { ...layer, effects: layer.effects.filter(effect => effect.id !== action.payload.effectId) }
              : layer
          ),
        },
      };
    case 'UPDATE_EFFECT_CONFIG':
      return {
        ...state,
        activeSoundscape: {
          ...state.activeSoundscape,
          layers: state.activeSoundscape.layers.map(layer =>
            layer.id === action.payload.layerId
              ? {
                ...layer,
                effects: layer.effects.map(effect =>
                  effect.id === action.payload.effectId ? { ...effect, ...action.payload.updates } : effect
                ),
              }
              : layer
          ),
        },
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_AS_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, isRead: true } : n) };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'ADD_LOG':
      // Prevent logs from getting ridiculously huge
      const newLogs = [action.payload, ...state.logs];
      if (newLogs.length > 200) newLogs.pop();
      return { ...state, logs: newLogs };
    case 'SET_ACTIVE_PROFILE': {
      const profileToActivate = state.userProfiles.find(p => p.id === action.payload);
      if (!profileToActivate) return state;
      return {
        ...state,
        globalSettings: {
          ...state.globalSettings,
          activeProfileId: action.payload,
          masterVolume: profileToActivate.personalSettings.masterVolume,
          spatialAudioEnabled: profileToActivate.personalSettings.spatialAudioEnabled,
          aiRecommendationMode: profileToActivate.personalSettings.aiRecommendationsEnabled ? 'AMBIENT' : 'OFF',
          theme: profileToActivate.personalSettings.theme,
        },
        audioEngine: {
          ...state.audioEngine,
          masterVolume: profileToActivate.personalSettings.masterVolume,
          spatialAudioEnabled: profileToActivate.personalSettings.spatialAudioEnabled,
        },
        aiConversation: {
            ...state.aiConversation,
            messages: [
                { id: generateUniqueId(), role: 'SYSTEM', content: `The user has switched profiles. You are now assisting ${profileToActivate.username}.`, timestamp: new Date().toISOString() },
                ...state.aiConversation.messages
            ].slice(0, 20)
        }
      };
    }
    case 'ADD_USER_PROFILE':
        return { ...state, userProfiles: [...state.userProfiles, action.payload] };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfiles: state.userProfiles.map(p =>
          p.id === action.payload.userId ? { ...p, ...action.payload.updates } : p
        ),
      };
    case 'ADD_CUSTOM_SOUNDSCAPE_TO_PROFILE':
      return {
        ...state,
        userProfiles: state.userProfiles.map(p =>
          p.id === action.payload.userId ? { ...p, customSoundscapes: [...p.customSoundscapes, action.payload.soundscape] } : p
        ),
      };
    case 'DELETE_CUSTOM_SOUNDSCAPE_FROM_PROFILE':
      return {
        ...state,
        userProfiles: state.userProfiles.map(p =>
          p.id === action.payload.userId ? { ...p, customSoundscapes: p.customSoundscapes.filter(cs => cs.id !== action.payload.soundscapeId) } : p
        ),
      };
    case 'ADD_SOUND_ASSET':
      return { ...state, soundAssets: [...state.soundAssets, action.payload] };
    case 'DELETE_SOUND_ASSET':
      return { ...state, soundAssets: state.soundAssets.filter(asset => asset.id !== action.payload) };
    case 'ADD_PRESET':
      return { ...state, availablePresets: [...state.availablePresets, action.payload] };
    case 'DELETE_PRESET':
      return { ...state, availablePresets: state.availablePresets.filter(preset => preset.id !== action.payload) };
    case 'ADD_RULE_CONFIG': {
        const updatedPresetsWithNewRule = state.availablePresets.map(preset => {
            if (preset.id === state.activeSoundscape.id) {
              return { ...preset, adaptiveRules: [...preset.adaptiveRules, action.payload] };
            }
            return preset;
        });
        return {
            ...state,
            availablePresets: updatedPresetsWithNewRule,
            activeSoundscape: {
              ...state.activeSoundscape,
              activeAdaptiveRules: [...state.activeSoundscape.activeAdaptiveRules, action.payload],
            },
        };
    }
    case 'DELETE_RULE_CONFIG': {
        const updatedPresetsAfterRuleDelete = state.availablePresets.map(preset => ({
            ...preset,
            adaptiveRules: preset.adaptiveRules.filter(rule => rule.id !== action.payload),
        }));
        return {
            ...state,
            availablePresets: updatedPresetsAfterRuleDelete,
            activeSoundscape: {
              ...state.activeSoundscape,
              activeAdaptiveRules: state.activeSoundscape.activeAdaptiveRules.filter(rule => rule.id !== action.payload),
            },
        };
    }
    case 'SET_AUDIO_OUTPUT_DEVICE':
      return { ...state, audioEngine: { ...state.audioEngine, outputDevice: action.payload } };
    case 'SET_LOW_LATENCY_MODE':
      return { ...state, audioEngine: { ...state.audioEngine, lowLatencyMode: action.payload }, globalSettings: { ...state.globalSettings, lowLatencyMode: action.payload } };
    case 'SET_ACTIVE_DASHBOARD_TAB':
      return { ...state, activeDashboardTab: action.payload };
    case 'SET_ACTIVE_SETTINGS_TAB':
      return { ...state, activeSettingsTab: action.payload };
    case 'SET_ACTIVE_PROFILE_MANAGEMENT_TAB':
      return { ...state, activeProfileManagementTab: action.payload };
    case 'SET_ACTIVE_ADMIN_TAB':
      return { ...state, activeAdminTab: action.payload };
    case 'UPDATE_GLOBAL_SETTINGS':
        return { ...state, globalSettings: { ...state.globalSettings, ...action.payload } };
    case 'UPDATE_PLAYBACK_TIME':
        return { ...state, audioEngine: { ...state.audioEngine, currentPlaybackTimeSeconds: action.payload } };
    case 'SET_AGENT_ACTIVITY':
        return { ...state, activeSoundscape: { ...state.activeSoundscape, lastAgentActivity: action.payload } };
    case 'INITIALIZE_STATE':
      return { ...action.payload, isLoading: false, error: null, audioEngine: { ...initialSoundscapeState.audioEngine, isPlaying: false } };
    case 'RESET_STATE':
      // Clear local storage on reset to prevent it from reloading the old state on refresh
      localStorage.removeItem('soundscapeAppState');
      return initialSoundscapeState;
      
    // New "Meta" Reducer Cases
    case 'POST_TO_SYSTEM_BUS':
        const newBus = [action.payload, ...state.systemBus];
        if (newBus.length > 50) newBus.pop();
        return { ...state, systemBus: newBus };
    case 'CLEAR_SYSTEM_BUS':
        return { ...state, systemBus: [] };
    case 'ADD_CHAT_MESSAGE':
        const newMessages = [...state.aiConversation.messages, action.payload];
        if (newMessages.length > 50) newMessages.splice(0, newMessages.length - 50); // Keep conversation history trim
        return { ...state, aiConversation: { ...state.aiConversation, messages: newMessages } };
    case 'SET_AI_IS_TYPING':
        return { ...state, aiConversation: { ...state.aiConversation, isTyping: action.payload } };
    case 'SET_AI_MODEL':
        return { ...state, aiConversation: { ...state.aiConversation, activeModel: action.payload } };

    default:
      return state;
  }
};


// --- Utility Functions & Simulated Services ---

/**
 * Generates a unique-ish ID. It's not a real UUID, but it's good enough for our purposes.
 * It's like calling your kid "Aple" instead of "Apple" to be unique. It'll probably be fine.
 */
export const generateUniqueId = (): string => Math.random().toString(36).substring(2, 15);

/**
 * Fakes a call to a weather API. Because making real API calls in a demo is a great way to leak your API keys.
 * This function just makes up some weather. Is it accurate? No. Is it entertaining? Also no. But it works.
 */
export const simulateFetchWeatherData = async (): Promise<Partial<EnvironmentalData>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const weatherConditions: EnvironmentalData['weatherCondition'][] = ['CLEAR', 'CLOUDY', 'RAIN', 'STORM', 'SNOW', 'FOG'];
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      resolve({ weatherCondition: randomWeather, temperatureCelsius: Math.floor(Math.random() * 25) + 5 });
    }, 1500);
  });
};

/**
 * Fakes a call to an office sensor API. This pretends to know how many people are in your office
 * and how chaotic it is. It's probably more accurate than the actual sensors.
 */
export const simulateFetchOfficeSensorData = async (): Promise<Partial<OfficeSensorData>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const occupancy = Math.floor(Math.random() * 50);
      let activity: OfficeSensorData['averageActivityLevel'] = 'LOW';
      if (occupancy > 15) activity = 'MEDIUM';
      if (occupancy > 35) activity = 'HIGH';
      resolve({ occupancyCount: occupancy, averageActivityLevel: activity });
    }, 1000);
  });
};

/**
 * Simulates an AI recommendation engine. This is a bunch of `if` statements that pretend to be a sophisticated AI.
 * It's the programming equivalent of putting on a lab coat and glasses to look smarter.
 */
export const simulateAIRecommendation = async (state: SoundscapeAppState): Promise<{ message: string; recommendedPresetId?: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const { weatherCondition } = state.environmentalData;
      const { averageActivityLevel } = state.officeSensorData;
      let recommendation = "Analyzing your environment...";
      let recommendedPresetId: string | undefined;

      if (weatherCondition === 'STORM' || weatherCondition === 'RAIN') {
        recommendation = 'It\'s raining. A soundscape with rain might feel... appropriate.';
        recommendedPresetId = state.availablePresets.find(p => p.tags.includes('rain'))?.id;
      } else if (averageActivityLevel === 'HIGH') {
        recommendation = 'Things seem hectic. Maybe a focus-enhancing soundscape could help.';
        recommendedPresetId = state.availablePresets.find(p => p.tags.includes('focus'))?.id;
      } else {
        recommendation = 'The vibes are neutral. How about a "Forest Retreat"? Trees are nice.';
        recommendedPresetId = state.availablePresets.find(p => p.tags.includes('nature'))?.id;
      }
      
      const recommendedPreset = state.availablePresets.find(p => p.id === recommendedPresetId);
      if (recommendedPreset && recommendedPreset.id !== state.activeSoundscape.id) {
        resolve({ message: `${recommendation} How about switching to "${recommendedPreset.name}"?`, recommendedPresetId: recommendedPreset.id });
      } else {
        resolve({ message: 'Everything seems fine. The current soundscape is probably good.' });
      }
    }, 2000);
  });
};

/**
 * The simulated brain for our AI chat. It takes your message and the entire app state,
 * and produces a response that sounds like it was written by a real AI. It's all smoke and mirrors, but it's fun.
 */
export const getAISimulatedResponse = async (model: AIModelProvider, messages: ChatMessage[], state: SoundscapeAppState): Promise<string> => {
    const lastUserMessage = messages.filter(m => m.role === 'USER').pop()?.content.toLowerCase() || '';
    const activeUser = state.userProfiles.find(p => p.id === state.globalSettings.activeProfileId);

    const modelPersonalities: Record<AIModelProvider, { intro: string; style: (s: string) => string }> = {
        CHAT_GPT: { intro: 'As a large language model, ', style: s => s },
        GEMINI: { intro: 'Based on the data available, ', style: s => `I can certainly help with that. ${s}` },
        CLAUDE: { intro: '', style: s => `I've considered your request carefully. ${s} I hope this is helpful!` },
        LOCAL_LLAMA: { intro: 'Running locally... ', style: s => s.replace(/[aeiou]/g, '') }, // just for fun
    };

    const personality = modelPersonalities[model];
    
    // Simple keyword-based logic
    if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi')) {
        return personality.style(`Hello, ${activeUser?.username}! How can I help you orchestrate your sound environment today?`);
    }
    if (lastUserMessage.includes('weather')) {
        return personality.style(`the current weather is ${state.environmentalData.weatherCondition} with a temperature of ${state.environmentalData.temperatureCelsius}°C.`);
    }
    if (lastUserMessage.includes('make me a soundscape') || lastUserMessage.includes('create a soundscape')) {
        if (lastUserMessage.includes('rainy') || lastUserMessage.includes('focus')) {
            return personality.style(`I've created a soundscape for you called "AI Rainy Focus". It includes 'Light Rain' and 'Lo-fi Study Beats'. I'll activate it for you now.`);
        }
        return personality.style(`Sure! What kind of vibe are you going for? Relaxing? Energetic? Something to help you focus?`);
    }
    if (lastUserMessage.includes('who are you')) {
        return personality.style(`I am an AI assistant integrated within this application. My model is currently set to ${model}. I can help you control the soundscape, get information from the application state, and even tell you about the other "files" this application knows about.`);
    }
    if (lastUserMessage.includes('files') || lastUserMessage.includes('other apps')) {
        const fileList = state.fileSystemKnowledge.knownPeers.map(f => `\n- ${f.name} (${f.sizeKB}KB): ${f.functionality}`).join('');
        return personality.style(`This application is aware of several other conceptual files:${fileList}`);
    }

    return personality.style(`I'm not quite sure how to handle that request. You could ask me to make a soundscape, or ask about the current weather or office status.`);
};


/**
 * The engine that applies the adaptive rules. It's a loop that checks all the "if-this-then-that" rules
 * against the current state of the world and applies any changes.
 * This is where the app starts to feel "alive".
 */
export const applyAdaptiveRules = (state: SoundscapeAppState, dispatch: React.Dispatch<SoundscapeAction>): SoundLayerConfig[] => {
  let updatedLayers = JSON.parse(JSON.stringify(state.activeSoundscape.layers)) as SoundLayerConfig[];

  const context = { ...state.environmentalData, ...state.officeSensorData };

  state.activeSoundscape.activeAdaptiveRules.forEach(rule => {
    try {
      // WARNING: This is using `new Function()` which is basically `eval()`. In a real app, this is a HUGE security risk.
      // We'd use a safe expression parser. But for a self-contained mega-file, we're living on the edge.
      const conditionMet = new Function('context', `with(context) { return ${rule.condition}; }`)(context);

      if (conditionMet) {
        if (rule.action === 'MODIFY_LAYER' && rule.actionParams.layerId) {
          updatedLayers = updatedLayers.map(layer => {
            if (layer.id === rule.actionParams.layerId) {
              return { ...layer, ...rule.actionParams };
            }
            return layer;
          });
        }
      }
    } catch (e: any) {
      dispatch({ type: 'ADD_LOG', payload: { timestamp: new Date().toISOString(), level: 'ERROR', message: `Error evaluating rule '${rule.name}': ${e.message}` } });
    }
  });

  return updatedLayers;
};

/**
 * A fake sound engine. It doesn't actually play audio because this is running in a browser environment
 * where we can't just access the file system. But it *pretends* to. It keeps track of what *should* be playing.
 * It's the little engine that could(n't).
 */
export class MockAudioEngine {
  public sources: Map<string, any> = new Map();
  private masterVolume: number = 0.75;
  private isPlaying: boolean = false;
  private log: (level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR', message: string) => void;
  private onPlaybackTimeUpdate: (time: number) => void;
  private playbackInterval: any;

  constructor(logger: (level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR', message: string) => void, onPlaybackTimeUpdate: (time: number) => void) {
    this.log = logger;
    this.onPlaybackTimeUpdate = onPlaybackTimeUpdate;
    this.log('INFO', 'MockAudioEngine initialized. Ready to pretend to make noise.');
  }

  setMasterVolume(volume: number) { this.masterVolume = volume; this.log('DEBUG', `Audio Engine: Master volume set to ${volume.toFixed(2)}`); }
  toggleSpatialAudio(enabled: boolean) { this.log('DEBUG', `Audio Engine: Spatial audio ${enabled ? 'enabled' : 'disabled'}.`); }
  
  loadSoundAsset(asset: SoundAsset): Promise<void> {
    return new Promise(resolve => {
      this.log('DEBUG', `Audio Engine: Pretending to load asset: ${asset.name}`);
      setTimeout(() => { this.sources.set(asset.id, { asset, status: 'READY' }); resolve(); }, 500);
    });
  }

  playLayer(layer: SoundLayerConfig) {
      if (layer.isEnabled && !layer.isMuted && this.isPlaying) {
        this.log('DEBUG', `Audio Engine: Playing layer: ${layer.name}`);
      }
  }

  stopLayer(assetId: string) { this.log('DEBUG', `Audio Engine: Stopped layer for asset: ${assetId}`); }
  stopAllLayers() { this.isPlaying = false; if (this.playbackInterval) clearInterval(this.playbackInterval); this.onPlaybackTimeUpdate(0); this.log('INFO', 'Audio Engine: All layers stopped.'); }
  pauseAllLayers() { this.isPlaying = false; if (this.playbackInterval) clearInterval(this.playbackInterval); this.log('INFO', 'Audio Engine: All layers paused.'); }
  
  resumeAllLayers() {
      this.isPlaying = true;
      if (this.playbackInterval) clearInterval(this.playbackInterval);
      let time = 0;
      this.playbackInterval = setInterval(() => {
          if (this.isPlaying) {
              time++;
              this.onPlaybackTimeUpdate(time);
          }
      }, 1000);
      this.log('INFO', 'Audio Engine: Resuming all layers.');
  }
  
  cleanup() {
    this.stopAllLayers();
    this.log('INFO', 'Audio Engine: Cleaned up all resources. The silence is deafening.');
  }
}


// --- The Conductor: The `useSoundscapeEngine` Custom Hook ---

/**
 * This is the master controller for all the "side effects" - the messy stuff that interacts with the outside world.
 * Fetching data, playing audio, saving to local storage... it all happens here.
 * It's like the stage manager of a play, running around behind the scenes to make sure everything happens when it should.
 * It uses the state and the dispatch function, but it never renders any UI itself. It's a creature of pure logic.
 */
export const useSoundscapeEngine = (
  state: SoundscapeAppState,
  dispatch: React.Dispatch<SoundscapeAction>
) => {
  const audioEngineRef = useRef<MockAudioEngine | null>(null);

  const logToState = useCallback((level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR', message: string) => {
    dispatch({ type: 'ADD_LOG', payload: { timestamp: new Date().toISOString(), level, message } });
  }, [dispatch]);
  
  const onPlaybackTimeUpdate = useCallback((time: number) => {
      dispatch({ type: 'UPDATE_PLAYBACK_TIME', payload: time });
  }, [dispatch]);

  // Initialize audio engine once
  useEffect(() => {
    audioEngineRef.current = new MockAudioEngine(logToState, onPlaybackTimeUpdate);
    state.soundAssets.forEach(asset => audioEngineRef.current?.loadSoundAsset(asset));
    return () => audioEngineRef.current?.cleanup();
  }, [logToState, onPlaybackTimeUpdate, state.soundAssets]);

  // Audio playback logic
  useEffect(() => {
    const engine = audioEngineRef.current;
    if (!engine) return;
    engine.setMasterVolume(state.globalSettings.masterVolume);
    engine.toggleSpatialAudio(state.globalSettings.spatialAudioEnabled);

    if (state.audioEngine.isPlaying) {
      engine.resumeAllLayers();
    } else {
      engine.pauseAllLayers();
    }
    
    state.activeSoundscape.layers.forEach(layer => engine.playLayer(layer));
  }, [state.audioEngine.isPlaying, state.globalSettings, state.activeSoundscape.layers]);
  
  // Save state to local storage
  useEffect(() => {
    const debounceSave = setTimeout(() => {
      localStorage.setItem('soundscapeAppState', JSON.stringify(state));
    }, 1000);
    return () => clearTimeout(debounceSave);
  }, [state]);

  // Load state from local storage on startup
  useEffect(() => {
    const storedState = localStorage.getItem('soundscapeAppState');
    if (storedState) {
      try {
        dispatch({ type: 'INITIALIZE_STATE', payload: JSON.parse(storedState) });
      } catch (e) {
        logToState('ERROR', 'Failed to parse stored state. Starting fresh.');
      }
    }
  }, [dispatch, logToState]);

  // Simulate external data feeds
  useEffect(() => {
    const fetchData = async () => {
      const weather = await simulateFetchWeatherData();
      const office = await simulateFetchOfficeSensorData();
      dispatch({ type: 'UPDATE_ENVIRONMENTAL_DATA', payload: weather });
      dispatch({ type: 'UPDATE_OFFICE_SENSOR_DATA', payload: office });
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Apply adaptive rules when data changes
  useEffect(() => {
    const newLayers = applyAdaptiveRules(state, dispatch);
    newLayers.forEach((layer, i) => {
      if (JSON.stringify(layer) !== JSON.stringify(state.activeSoundscape.layers[i])) {
        dispatch({ type: 'UPDATE_LAYER_CONFIG', payload: { layerId: layer.id, updates: layer } });
      }
    });
  }, [state.environmentalData, state.officeSensorData, dispatch, state]);
  
  // Handle AI Chatbot responses
  useEffect(() => {
    const lastMessage = state.aiConversation.messages[state.aiConversation.messages.length - 1];
    if (lastMessage && lastMessage.role === 'USER') {
        dispatch({ type: 'SET_AI_IS_TYPING', payload: true });
        getAISimulatedResponse(state.aiConversation.activeModel, state.aiConversation.messages, state).then(responseContent => {
            // A special command parser for the AI
            if (responseContent.includes("I'll activate it for you now.")) {
                const newPreset = {
                    id: generateUniqueId(),
                    name: "AI Rainy Focus",
                    description: "A custom soundscape created by the AI for you.",
                    layers: [
                        { id: 'layer-rain-1', name: 'Light Rain', assetId: 'asset-rain-light', volume: 0.6, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] },
                        { id: 'layer-lofi-1', name: 'Lo-fi Beats', assetId: 'asset-lofi-beats', volume: 0.4, pan: 0, isEnabled: true, isMuted: false, isSoloed: false, loop: true, startTimeOffsetSeconds: 0, endTimeOffsetSeconds: 0, effects: [] },
                    ],
                    adaptiveRules: [], tags: ['ai-generated'], isCustom: true
                };
                dispatch({ type: 'ADD_CUSTOM_SOUNDSCAPE_TO_PROFILE', payload: { userId: state.globalSettings.activeProfileId, soundscape: newPreset } });
                dispatch({ type: 'SET_ACTIVE_SOUNDSCAPE_PRESET', payload: { presetId: newPreset.id, userId: state.globalSettings.activeProfileId } });
            }

            dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { id: generateUniqueId(), role: 'AI', content: responseContent, model: state.aiConversation.activeModel, timestamp: new Date().toISOString() }});
            dispatch({ type: 'SET_AI_IS_TYPING', payload: false });
        });
    }
  }, [state.aiConversation.messages, state.aiConversation.activeModel, state, dispatch]);
};


// --- The Building Blocks: Reusable UI Components ---

interface TabButtonProps { label: string; isActive: boolean; onClick: () => void; }
export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button className={`px-4 py-2 text-sm font-medium rounded-t-lg ${isActive ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} onClick={onClick}>
    {label}
  </button>
);

interface InfoCardProps { title: string; value: string | number; }
export const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <div className="p-4 bg-gray-700 rounded-lg">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-xl font-semibold text-cyan-300">{value}</p>
  </div>
);

interface SliderControlProps { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; }
export const SliderControl: React.FC<SliderControlProps> = ({ label, value, min, max, step, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 flex justify-between"><span>{label}</span><span>{value.toFixed(2)}</span></label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
  </div>
);

// ... (other simple components like ToggleSwitch, SelectInput, InputField, Button can be kept similar to original for brevity in this thought process, but will be included in final output)
interface ButtonProps { onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger'; className?: string; disabled?: boolean; }
export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className, disabled }) => {
  const baseStyle = "px-4 py-2 rounded-md font-semibold transition-colors";
  const variants = { primary: "bg-cyan-600 text-white hover:bg-cyan-700", secondary: "bg-gray-600 text-gray-100 hover:bg-gray-500", danger: "bg-red-600 text-white hover:bg-red-700" };
  return <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled}>{children}</button>;
};

// --- The Grand UI Sections ---

interface DashboardSectionProps { state: SoundscapeAppState; dispatch: React.Dispatch<SoundscapeAction>; }
export const DashboardSection: React.FC<DashboardSectionProps> = ({ state, dispatch }) => (
  <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>
      <Button onClick={() => state.audioEngine.isPlaying ? dispatch({ type: 'PAUSE_SOUNDSCAPE' }) : dispatch({ type: 'PLAY_SOUNDSCAPE' })}>
        {state.audioEngine.isPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <InfoCard title="Current Weather" value={state.environmentalData.weatherCondition} />
      <InfoCard title="Office Activity" value={state.officeSensorData.averageActivityLevel} />
      <InfoCard title="Now Playing" value={state.activeSoundscape.name} />
    </div>
    <SliderControl label="Master Volume" value={state.globalSettings.masterVolume} min={0} max={1} step={0.01} onChange={(val) => dispatch({ type: 'ADJUST_MASTER_VOLUME', payload: val })} />
  </div>
);

interface SoundMixerSectionProps { state: SoundscapeAppState; dispatch: React.Dispatch<SoundscapeAction>; }
export const SoundMixerSection: React.FC<SoundMixerSectionProps> = ({ state, dispatch }) => (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6">Sound Mixer</h2>
        <div className="space-y-4">
            {state.activeSoundscape.layers.map(layer => (
                <div key={layer.id} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">{layer.name}</h3>
                    <SliderControl label="Volume" value={layer.volume} min={0} max={1} step={0.01} onChange={v => dispatch({ type: 'UPDATE_LAYER_CONFIG', payload: { layerId: layer.id, updates: { volume: v } } })} />
                    <SliderControl label="Pan" value={layer.pan} min={-1} max={1} step={0.01} onChange={v => dispatch({ type: 'UPDATE_LAYER_CONFIG', payload: { layerId: layer.id, updates: { pan: v } } })} />
                </div>
            ))}
        </div>
    </div>
);

interface AIChatSectionProps { state: SoundscapeAppState; dispatch: React.Dispatch<SoundscapeAction>; }
export const AIChatSection: React.FC<AIChatSectionProps> = ({ state, dispatch }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.aiConversation.messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { id: generateUniqueId(), role: 'USER', content: input, timestamp: new Date().toISOString() } });
        setInput('');
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl h-[80vh] flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-4">AI Assistant Chat</h2>
            <div className="flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto mb-4 space-y-4">
                {state.aiConversation.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role !== 'SYSTEM' && (
                           <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'USER' ? 'bg-cyan-700' : 'bg-gray-700'}`}>
                               <p className="text-white">{msg.content}</p>
                               <p className="text-xs text-gray-400 mt-1">{msg.role === 'AI' ? `via ${msg.model}`: 'You'}</p>
                           </div>
                       )}
                       {msg.role === 'SYSTEM' && (
                           <div className="w-full text-center text-xs text-gray-500 italic p-2 border-t border-b border-gray-700">
                               {msg.content}
                           </div>
                       )}
                    </div>
                ))}
                {state.aiConversation.isTyping && <div className="text-gray-400 italic">AI is typing...</div>}
                <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    className="flex-grow bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ask the AI to build a soundscape for you..."
                />
                <Button onClick={handleSend}>Send</Button>
            </div>
        </div>
    );
};

interface AdminSectionProps { state: SoundscapeAppState; dispatch: React.Dispatch<SoundscapeAction>; }
export const AdminSection: React.FC<AdminSectionProps> = ({ state, dispatch }) => (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6">Administrator Panel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">System Bus Monitor</h3>
                <div className="h-64 overflow-y-auto bg-gray-900 p-2 rounded font-mono text-xs space-y-1">
                    {state.systemBus.map(msg => (
                        <div key={msg.id}>
                            <span className="text-cyan-400">{msg.sender}</span> -&gt; <span className="text-yellow-400">{msg.receiver}</span>: <span className="text-gray-300">{msg.type}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">File System Knowledge</h3>
                <div className="h-64 overflow-y-auto bg-gray-900 p-2 rounded text-sm space-y-2">
                    <p><strong className="text-cyan-400">This File:</strong> {state.fileSystemKnowledge.thisFile.name} ({state.fileSystemKnowledge.thisFile.sizeKB}KB)</p>
                    <p><strong className="text-cyan-400">Peers:</strong></p>
                    <ul className="list-disc list-inside pl-4">
                        {state.fileSystemKnowledge.knownPeers.map(peer => (
                            <li key={peer.name}>{peer.name} ({peer.sizeKB}KB)</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);


// --- The Main Event: The Top-Level Component ---

/**
 * This is it. The component that ties everything together and renders the entire application.
 * It initializes the state with `useReducer`, plugs in the `useSoundscapeEngine` to handle all the logic,
 * and then renders the UI based on the current state. It's the grand conductor of our sonic orchestra.
 * If this component fails, the whole universe collapses. No pressure.
 */
export const DynamicSoundscapeGeneratorView: React.FC = () => {
  const [state, dispatch] = useReducer(soundscapeReducer, initialSoundscapeState);

  useSoundscapeEngine(state, dispatch);

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MIXER' | 'CHAT' | 'ADMIN'>('DASHBOARD');

  useEffect(() => {
    document.documentElement.className = state.globalSettings.theme.toLowerCase();
  }, [state.globalSettings.theme]);

  const activeProfileUsername = state.userProfiles.find(p => p.id === state.globalSettings.activeProfileId)?.username || 'Unknown User';

  return (
    <div className={`min-h-screen ${state.globalSettings.theme === 'DARK' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} flex flex-col p-4 font-sans`}>
      <header className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-cyan-400">Dynamic Soundscape Generator</h1>
        <div className="text-right">
            <p className="text-gray-300">Welcome, <span className="font-bold text-cyan-300">{activeProfileUsername}</span></p>
            <Button onClick={() => dispatch({ type: 'RESET_STATE' })} variant="danger" className="text-xs mt-1">Reset State</Button>
        </div>
      </header>

      <nav className="flex space-x-1 bg-gray-800 p-2 rounded-t-lg mb-4 shadow-md">
        <TabButton label="Dashboard" isActive={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
        <TabButton label="Mixer" isActive={activeTab === 'MIXER'} onClick={() => setActiveTab('MIXER')} />
        <TabButton label="AI Chat" isActive={activeTab === 'CHAT'} onClick={() => setActiveTab('CHAT')} />
        <TabButton label="Admin" isActive={activeTab === 'ADMIN'} onClick={() => setActiveTab('ADMIN')} />
      </nav>

      <main className="flex-grow">
        {activeTab === 'DASHBOARD' && <DashboardSection state={state} dispatch={dispatch} />}
        {activeTab === 'MIXER' && <SoundMixerSection state={state} dispatch={dispatch} />}
        {activeTab === 'CHAT' && <AIChatSection state={state} dispatch={dispatch} />}
        {activeTab === 'ADMIN' && <AdminSection state={state} dispatch={dispatch} />}
      </main>

      <footer className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} A Singular, Monumental File. All logic self-contained. Handle with care.
      </footer>
    </div>
  );
};
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/blueprints/DynamicSoundscapeGeneratorView.tsx
================================================================================

import React, { useState, useEffect } from 'react';

interface SoundscapeState {
  weather: string;
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  currentTrack: string; // e.g., "Calm Rain & Lo-fi Beats"
}

const DynamicSoundscapeGeneratorView: React.FC = () => {
  const [state, setState] = useState<SoundscapeState | null>(null);

  useEffect(() => {
    // MOCK LIVE DATA FEED
    const updateState = () => {
      const activity: SoundscapeState['activityLevel'] = Math.random() > 0.66 ? 'HIGH' : Math.random() > 0.33 ? 'MEDIUM' : 'LOW';
      setState({
        weather: "Cloudy",
        activityLevel: activity,
        currentTrack: activity === 'HIGH' ? "Uptempo Electronic" : "Ambient Focus Tones",
      });
    }
    updateState();
    const interval = setInterval(updateState, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (!state) return <div className="bg-gray-800 text-white p-6 rounded-lg">Initializing soundscape...</div>;
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dynamic Office Soundscape</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Current Weather</p>
          <p className="text-xl font-semibold">{state.weather}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Office Activity Level</p>
          <p className="text-xl font-semibold">{state.activityLevel}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Now Playing</p>
          <p className="text-xl font-semibold">{state.currentTrack}</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-2">Audio Simulation</p>
        <div className="w-full h-12 bg-gray-900 rounded-full flex items-center justify-center">
            <p className="text-cyan-300">♪ ♫ ♪</p>
        </div>
      </div>
    </div>
  );
};
export default DynamicSoundscapeGeneratorView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/blueprints/DynamicSoundscapeGeneratorView.tsx
================================================================================

import React, { useState, useEffect } from 'react';

interface SoundscapeState {
  weather: string;
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  currentTrack: string; // e.g., "Calm Rain & Lo-fi Beats"
}

const DynamicSoundscapeGeneratorView: React.FC = () => {
  const [state, setState] = useState<SoundscapeState | null>(null);

  useEffect(() => {
    // MOCK LIVE DATA FEED
    const updateState = () => {
      const activity: SoundscapeState['activityLevel'] = Math.random() > 0.66 ? 'HIGH' : Math.random() > 0.33 ? 'MEDIUM' : 'LOW';
      setState({
        weather: "Cloudy",
        activityLevel: activity,
        currentTrack: activity === 'HIGH' ? "Uptempo Electronic" : "Ambient Focus Tones",
      });
    }
    updateState();
    const interval = setInterval(updateState, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (!state) return <div className="bg-gray-800 text-white p-6 rounded-lg">Initializing soundscape...</div>;
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dynamic Office Soundscape</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Current Weather</p>
          <p className="text-xl font-semibold">{state.weather}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Office Activity Level</p>
          <p className="text-xl font-semibold">{state.activityLevel}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Now Playing</p>
          <p className="text-xl font-semibold">{state.currentTrack}</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-2">Audio Simulation</p>
        <div className="w-full h-12 bg-gray-900 rounded-full flex items-center justify-center">
            <p className="text-cyan-300">♪ ♫ ♪</p>
        </div>
      </div>
    </div>
  );
};
export default DynamicSoundscapeGeneratorView;
