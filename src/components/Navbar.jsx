import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import ProfileInfo from "./Card/ProfileInfo";
import SearchBar from "./input/SearchBar";
import { setAppElement } from "react-modal";

function Navbar({ userInfo, searchQuery,setSearchQuery, onSearchNote ,handleClearSearch}) {
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  };
  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("")
  };
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b">
      <Link
        to="/"
        className="text-2xl font-cursive text-blue-500 hover:text-blue-600 transition-colors"
      >
        Travel Story
      </Link>
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      </div>
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </nav>
  );
}

export default Navbar;
