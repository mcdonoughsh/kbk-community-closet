import Image from "next/image";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* White curved graphic element behind image */}
      <div className="absolute top-0 left-0 right-0 h-[200px] sm:h-[83px] bg-white rounded-b-[50%] sm:rounded-b-[60%]"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-5 sm:pb-5">
        {/* Clothes rack illustration */}
        <div className="relative z-20 mb-10 sm:mb-10">
          <Image
            src="/images/nav-rack.png"
            alt="Clothes rack with community items"
            width={300}
            height={300}    
            className="w-64 h-auto sm:w-80 sm:h-auto rounded-[10%]"
            priority
          />
        </div>
        
        {/* Main title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 text-center mb-8 sm:mb-12 z-20">
          {title}
        </h1>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 text-center mb-8 sm:mb-10 z-20">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
