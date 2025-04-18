import {
  LightBulbIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function Hackinator() {
  const features = [
    { title: 'Pitch only', icon: LightBulbIcon },
    { title: 'Readme Only', icon: DocumentTextIcon },
    { title: 'Discussion only', icon: ChatBubbleLeftRightIcon },
    { title: 'Idea only', icon: EyeIcon },
    { title: 'Go With Flow', icon: RocketLaunchIcon },
  ];

  return (
    <div className="relative min-h-screen p-6 bg-gray-50">
      
      {/* Features */}
      <div className="text-center mt-16">
        <h2 className="text-4xl font-bold mb-8 text-indigo-800 tracking-wide">FEATURES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="border border-indigo-300 p-6 rounded-lg text-sm bg-white shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center"
              >
                <Icon className="h-10 w-10 text-indigo-500 mb-3" />
                <div className="font-semibold text-indigo-700 mb-1">{feature.title}</div>
                <div className="text-xs text-gray-500 mb-4 text-center">
                  A short description or tutorial teaser.
                </div>
                <button className="mt-auto border border-indigo-600 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-600 hover:text-white transition text-xs">
                  Watch Tutorial
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
