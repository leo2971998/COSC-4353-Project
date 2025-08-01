export const WelcomeBanner = ({ name }) => {
  return (
    <div className="bg-[#222b45] rounded-xl p-6 mt-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Welcome back, {name}!
      </h1>
      <p className="text-gray-300">
        Thank you for your dedication. Your volunteer work makes a real
        difference in our community.
      </p>
    </div>
  );
};
