import { Tab,TabGroup,TabList, TabPanels} from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setSelected, children }) {
  return (
    <div className='w-full  sm:px-0'>
      <TabGroup>
        <TabList className='flex space-x-6 rounded-xl p-1'>
          {tabs.map((tab, index) => (
            <Tab
              style={{marginRight:10}}
              key={tab.title}
              onClick={() => setSelected(index)}
              className={({ selected }) =>
                classNames(
                  "rounded w-fit flex items-center outline-none gap-2 px-4 py-1 text-base font-medium leading-5 bg-white ",
                  selected
                    ? "text-blue-700  border-b-2 border-blue-600"
                    : "text-gray-800  hover:text-blue-800"
                )
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab> 
          ))}
        </TabList>
        <TabPanels className='w-full mt-2'>{children}</TabPanels>
      </TabGroup>
    </div>
  );
}
