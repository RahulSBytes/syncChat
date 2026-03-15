import { X } from "lucide-react";
import { useUIStore } from "../store/store.js";
import { useState, useEffect, useRef } from "react";
import toast from 'react-hot-toast';
import { useApiStore } from "../store/apiStore.js";

const FindDialog = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleInviteApi = useApiStore((state) => state.handleInvite)
  const fetchUsersEligibleForInvitation = useApiStore((state) => state.fetchUsersEligibleForInvitation)
  const debounceTimeoutRef = useRef(null);
  const setIsSearchPeopleClicked = useUIStore((state) => state.setIsSearchPeopleClicked);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const data = await fetchUsersEligibleForInvitation(searchQuery);
          setUsers(data);
        } catch (err) {
          console.error("Error fetching users:", err);
          setUsers([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [searchQuery]);


  async function handleInvite(userId) {
    const success = await handleInviteApi(userId);
    if (!success) return toast.error("Error sending request");
    toast.success("Request sent");
    setUsers(prev => prev.filter(user => user._id !== userId));
  }


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface dark:bg-surface-dark w-full max-w-md rounded-lg shadow-lg px-12 py-8 pb-10 relative">
        <X
          onClick={setIsSearchPeopleClicked}
          className="absolute top-6 right-6 text-muted dark:text-muted-dark cursor-pointer"
          size={20}
          strokeWidth={3}
          color="#c1c1c1"
        />
        <h2 className="text-xl font-semibold mb-6 text-center text-primary dark:text-primary-dark">
          Find People On <span className="font-bold text-[#248F60]">SynqChat</span>
        </h2>

        <div className="flex flex-col gap-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Enter Username or Email"
              className="w-full rounded  bg-searchbar dark:bg-searchbar-dark text-secondary dark:text-secondary-dark px-3 py-1 outline-none"
            />
          </form>

          {isLoading && <div className="text-center text-secondary dark:text-secondary-dark">Searching...</div>}

          {!isLoading && searchQuery.trim() && (
            <>
              {users.length > 0 ? (
                <div className="flex flex-col gap-3 pl-2 max-h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
                  {users.map(({ avatar, username, _id, fullName }) => (
                    <div key={_id} className="items-center flex justify-between pr-4">
                      <div className="flex gap-2 items-center">
                        <img
                          src={avatar?.url || avatar || "/image.png"}
                          className="h-8 w-8 rounded-full border-[2px] border-[#248F60] object-cover"
                          alt={`${username} avatar`}
                        />
                        <div className="flex flex-col">
                          <span className="line-clamp-1 font-semibold text-secondary dark:text-secondary-dark">{username}</span>
                          {fullName && (
                            <span className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                              {fullName}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(_id)}
                        className="px-3 h-6 rounded-md text-xs bg-[#248F60] text-white font-medium hover:bg-[#1f744e] transition"
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No users found</p>
              )}
            </>
          )}

          {!searchQuery.trim() && (
            <p className="text-center text-muted dark:text-muted-dark mt-4">Start typing to search for users</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDialog;