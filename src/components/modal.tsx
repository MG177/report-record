import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  header?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  header = 'Header',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 pt-4 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex justify-end">
          <h2 className="font-bold text-2xl w-full">{header}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
