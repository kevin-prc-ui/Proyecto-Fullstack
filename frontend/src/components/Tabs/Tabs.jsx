import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/react";
import Button from "../Button";
import { IoMdAdd } from "react-icons/io";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, selected, setSelected, children, status }) {
  return (
    <div className='w-full sm:px-0'>
      <TabGroup selectedIndex={selected} onChange={setSelected}>
        <TabList className='flex space-x-6 rounded-xl '>
          {!status && ( // Only show "Create Ticket" if no filter is applied
          <Button
            label="Crear ticket"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded"
            // onClick={() => { /* Add navigation or modal logic */ }}
          />
        )}
          {tabs.map((tab) => (
            <Tab
              key={tab.title}
              style={{marginLeft: '10px'}}
              className={({ selected }) =>
                classNames(
                  "rounded w-fit flex items-center outline-none gap-2 px-4 py-1 text-base font-medium leading-5 bg-white",
                  selected
                    ? "text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-800 hover:text-blue-800"
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