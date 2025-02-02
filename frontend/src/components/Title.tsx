import { useNavigate } from "react-router-dom";

interface TitleProps {
  imageSrc: string;
}

const Title: React.FC<TitleProps> = ({ imageSrc }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div
      className="flex items-center gap-4 cursor-pointer p-10"
      onClick={handleLogoClick}
    >
      <div className="w-16 h-16 rounded-full">
        <img src={imageSrc} alt="Company Logo" className="w-full h-full object-cover rounded-full" />
      </div>
      <h2 className="text-2xl font-bold text-blue-700">ConvoServe</h2>
    </div>
  );
};

export default Title;
