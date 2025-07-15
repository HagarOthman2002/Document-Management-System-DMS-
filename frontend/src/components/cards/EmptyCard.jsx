const EmptyCard = ({ optionalGreet, imgSrc, title, message, ...props }) => {
  return (
    <>
      <h1 className="text-4xl font-5xlg text-slate-700  leading-7 mt-5 ">
        {optionalGreet}
      </h1>

      <div
        className="flex flex-col items-center justify-center mt-20"
        {...props}
      >
        <img src={imgSrc} alt="No Products" className="w-50  " />
        <h1 className="w-1/2 text-4xl font-lg text-slate-700 text-center leading-7 mt-5">
          {title}
        </h1>
        <p className=" text-md font-lg text-slate-700 text-center leading-7 mt-5">
          {message}
        </p>
      </div>
    </>
  );
};

export default EmptyCard;
