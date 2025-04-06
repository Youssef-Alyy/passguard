import "./kebab.scss";
import { useState, useEffect, useRef } from "react";

interface KebabState {
	Kebab: boolean;
}

type KebabProps = {
	onUpdateClick?: () => void;
	onShareClick?: () => void;
	onDeleteClick?: () => void;
	onRecoverClick?: () => void;
	onPermanentRemoveClick?: () => void;
	isTrashed?: boolean;
	isCard?: boolean;
};

const Kebab: React.FC<KebabProps> = (props: KebabProps) => {
	const [isOpen, setIsOpen] = useState<KebabState>({
		Kebab: false,
	});
	const kebabRef = useRef<HTMLDivElement>(null);

	const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setIsOpen({
			Kebab: !isOpen.Kebab,
		});
	};

	const handleClickOnUpdate = () => {
		if (props.onUpdateClick) {
			props.onUpdateClick();
		}
	};
	const handleClickOnShare = () => {
		if (props.onShareClick) {
			props.onShareClick();
		}
	};
	const handleClickOnDelete = () => {
		if (props.onDeleteClick) {
			props.onDeleteClick();
		}
	};
	const handleClickOnRecover = () => {
		if (props.onRecoverClick) {
			props.onRecoverClick();
		}
	};
	const handleClickOnPermanentRemove = () => {
		if (props.onPermanentRemoveClick) {
			props.onPermanentRemoveClick();
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (kebabRef.current && !kebabRef.current.contains(event.target as Node)) {
			setIsOpen({
				Kebab: false,
			});
		}
	};
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div id="kebab" ref={kebabRef}>
			<div className="kebab" onClick={handleOnClick}>
				<figure></figure>
				<figure
					className={`${isOpen.Kebab ? "middle active" : "middle"}`}
				></figure>
				<p className={`${isOpen.Kebab ? "cross active" : "cross"}`}>x</p>
				<figure></figure>
				<ul
					className={`bg-black rounded-lg w-fit dark:bg-darkinset-999 ${
						isOpen.Kebab ? "dropdown active" : "dropdown"
					}`}
				>
					{props.isCard ? (
						<>
							<li
								key="1"
								id="1"
								className="text-xs"
								onClick={handleClickOnDelete}
							>
								<p>Delete</p>
							</li>
						</>
					) : !props.isTrashed ? (
						<>
							<li
								key="1"
								id="1"
								className="text-xs"
								onClick={handleClickOnUpdate}
							>
								<p>Update</p>
							</li>
							<li
								key="2"
								id="2"
								className="text-xs"
								onClick={handleClickOnShare}
							>
								<p>Share</p>
							</li>

							<li
								key="3"
								id="3"
								className="text-xs"
								onClick={handleClickOnDelete}
							>
								<p>Delete</p>
							</li>
						</>
					) : (
						<>
							<li
								key="1"
								id="1"
								className="text-xs"
								onClick={handleClickOnRecover}
							>
								<p>Recover</p>
							</li>

							<li
								key="2"
								id="2"
								className="text-xs"
								onClick={handleClickOnPermanentRemove}
							>
								<p>Remove</p>
							</li>
						</>
					)}
				</ul>
			</div>
		</div>
	);
};
export default Kebab;
