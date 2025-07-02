function SessionCard({ title }) {
  return (
    <div className="flex h-[5vh] w-full items-center justify-start rounded-md bg-[#0A0C19] px-2 sm:h-[6vh] sm:px-3 md:h-[7vh] lg:h-[8vh]">
      <p className="montserrat text-xs text-[#adadad] sm:text-sm md:text-base lg:text-lg">
        {title}
      </p>
    </div>
  );
}

export default SessionCard;
