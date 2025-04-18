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
    <div className="relative h-auto p-6 flex flex-col justify-center">

      {/* Features */}
      <div className="text-center mt-12">
        <h2 className="text-5xl font-extrabold mb-12 text-indigo-800 tracking-wide">FEATURES</h2>

        {/* First Row - 3 Cards */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {features.slice(0, 3).map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="border bg-slate-300 border-indigo-300 p-8 rounded-xl text-base shadow-md hover:shadow-xl transition cursor-pointer flex flex-col items-center w-72"
              >
                <Icon className="h-14 w-14 text-indigo-500 mb-4" />
                <div className="font-semibold text-indigo-700 text-xl mb-2">{feature.title}</div>
                <div className="text-sm text-gray-600 mb-6 text-center max-w-xs">
                  A short description or tutorial teaser.
                </div>
                <button className="mt-auto border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition text-sm font-medium">
                  Watch Tutorial
                </button>
              </div>
            );
          })}
        </div>

        {/* Second Row - Remaining Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {features.slice(3).map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="border bg-slate-300 border-indigo-300 p-8 rounded-xl text-base shadow-md hover:shadow-xl transition cursor-pointer flex flex-col items-center w-72"
              >
                <Icon className="h-14 w-14 text-indigo-500 mb-4" />
                <div className="font-semibold text-indigo-700 text-xl mb-2">{feature.title}</div>
                <div className="text-sm text-gray-600 mb-6 text-center max-w-xs">
                  A short description or tutorial teaser.
                </div>
                <button className="mt-auto border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition text-sm font-medium">
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
