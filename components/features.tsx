import {
  BarChart3,
  Download,
  FileUp,
  Shield,
  Sparkles,
  Table,
} from 'lucide-react';

const features = [
  {
    icon: <FileUp className="h-10 w-10" />,
    title: 'Easy File Upload',
    description:
      'Support for CSV, Excel, and text files with drag-and-drop functionality.',
  },
  {
    icon: <Sparkles className="h-10 w-10" />,
    title: 'Intelligent Analysis',
    description:
      'Automatic detection of data issues, duplicates, and outliers.',
  },
  {
    icon: <Table className="h-10 w-10" />,
    title: 'Interactive Cleaning',
    description:
      'Clean your data with intuitive tools and real-time previews.',
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title: 'Data Insights',
    description:
      'View comprehensive statistics and visualizations of your data.',
  },
  {
    icon: <Download className="h-10 w-10" />,
    title: 'Multiple Formats',
    description:
      'Download your cleaned data in various formats including CSV and Excel.',
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: 'Privacy First',
    description:
      'No account required. Your data is processed securely and deleted immediately.',
  },
];

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="p-4 bg-white rounded-full shadow-sm dark:bg-gray-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}