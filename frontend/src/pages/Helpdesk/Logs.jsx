import { Transition } from '@headlessui/react'
import React from 'react'

export const Logs = () => {
  return (
    <Transition
      as="div"
      appear
      show
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      className=""
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <div>Logs</div>
        </h2>
      </div>
    </Transition>
  )
}
