import React from 'react'

function Tab({ selectedType, label, value, setSelectedType }) {
    return (
        <span onClick={() => setSelectedType(value)} className={`cursor-pointer py-[2px]  px-2 rounded-full text-sm w-16 text-center text-muted dark:text-muted-dark ${selectedType === value && "bg-message-received-bg  text-zinc-700 dark:text-zinc-700 font-medium"}`}>{label}</span>
    )
}

export default Tab