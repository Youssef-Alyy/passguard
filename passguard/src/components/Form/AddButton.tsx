

type AddButtonProps = {
	onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AddButton = (props: AddButtonProps) => {
	return (
		<>
			<div className="h-min w-min">
				<i
					onClick={props.onClick}
					className=" text-white font-bold p-0 m-0 rounded-full"
				>
					<svg
						className="w-10 h-10 text-blue-500  hover:text-yellow-400 transition-all duration-300 cursor-pointer"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 19 20"
					>
						<path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
					</svg>
					<span className="sr-only">Icon description</span>
				</i>
			</div>
		</>
	);
};

export default AddButton;
