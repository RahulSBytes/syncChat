import { useUIStore } from '../store/store.js'


function Home() {

  const { setIsNewGroupClicked, setIsSearchPeopleClicked } = useUIStore();

  return (
    <div className="flex flex-1 flex-col h-full items-center justify-center p-6 text-center bg-surface dark:bg-surface-dark">
      <img src="/logo.png" alt="Chat Placeholder" className=" h-32 mb-6 opacity-80" />

      <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark">Welcome to SynqChat</h2>
      <p className="text-sm text-secondary dark:text-secondary-dark font-semibold mb-6">Start a conversation or connect with friends</p>

      <div className="flex gap-6">
        <button onClick={setIsNewGroupClicked} className="px-4 rounded-md text-xs bg-[#248F60] text-white font-medium hover:bg-[#1f744e] transition"
        > New Group</button>
        <button onClick={setIsSearchPeopleClicked} className="px-8 py-2  rounded-md text-xs border border-[#248F60] text-[#248F60] font-medium hover:bg-[#248F60]/10 transition">
          Invite
        </button>
      </div>
    </div>
  )
}

export default Home