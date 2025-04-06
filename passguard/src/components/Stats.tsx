import blueinfo from "../assets/icons/stats/blueinfo.svg";
import redinfo from "../assets/icons/stats/redinfo.svg";
import refresh from "../assets/icons/stats/refresh.svg";
import purpleinfo from "../assets/icons/stats/purpleinfo.svg";
import { useEffect, useState } from "react";
import CredentialService from "../utils/credentialService";
import { useLocation } from "react-router-dom";

const credentialService = new CredentialService();

type StatsProps = {
	sync: boolean;
};

const Stats = (props: StatsProps) => {
	const [totalCredentials, setTotalCredentials] = useState<number>(0);
	const [totalWeakPasswords, setTotalWeakPasswords] = useState<number>(0);
	const [totalOldPasswords, setTotalOldPasswords] = useState<number>(0);
	const [totalReusedPasswords, setTotalReusedPasswords] = useState<number>(0);
	const [refreshCount, setRefreshCount] = useState<number>(0);

	const location = useLocation();
	const user = location.state.user;

	useEffect(() => {
		const fetchData = async () => {
			try {
				await credentialService.checkOldPasswordStatus(user.userId);
				setTimeout(async () => {
					const total =
						await credentialService.getTotalCredentialsCountByUserId(
							user.userId
						);
					const totalWeak =
						await credentialService.getWeakPasswordsCountByUserIdRequest(
							user.userId
						);
					const totalReused =
						await credentialService.getReusedPasswordsCountByUserIdRequest(
							user.userId
						);

					const totalOld =
						await credentialService.getOldPasswordsCountByUserIdRequest(
							user.userId
						);
					setTotalCredentials(total);
					setTotalWeakPasswords(totalWeak);
					setTotalReusedPasswords(totalReused);
					setTotalOldPasswords(totalOld);
				}, 100);
			} catch (error) {
				console.error("Error fetching credentials:", error);
			}
		};
		fetchData();
		console.log("Stats Refreshed");
	}, [refreshCount, props.sync]);
	const handleRefreshClick = () => {
		setRefreshCount((refreshCount) => refreshCount + 1);
	};
	let weakWidth = 0,
		reusedWidth = 0,
		oldWidth = 0,
		totalWidth = 0;
	if (totalCredentials != 0) {
		weakWidth = (totalWeakPasswords / totalCredentials) * 1000;
		reusedWidth = (totalReusedPasswords / totalCredentials) * 1000;
		oldWidth = (totalOldPasswords / totalCredentials) * 1000;
		totalWidth = 1000 - (weakWidth + reusedWidth + oldWidth);
	}

	return (
		<div className="w-full p-2 h-fit m-3">
			<div className="flex">
				<h5 className="p-1 text-xl font-medium dark:text-darktext-999">
					Password Analysis{" "}
				</h5>
			</div>

			<div className="flex items-center border-b-2 pb-5 dark:border-darkborder-999">
				<div className="flex-row w-60 h-fit m-1">
					<div className="flex">
						{weakWidth != 0 ? (
							<div
								className={`flex p-2 ${reusedWidth == 0 && oldWidth == 0 ? "rounded-r-md" : ""} bg-red-500 rounded-l-md h-8 text-center text-xs justify-center items-center text-white font-nunito font-bold`}
								style={{ width: `${weakWidth}%` }}
							>
								Weak
							</div>
						) : null}
						{reusedWidth != 0 ? (
							<div
								className={`flex p-2 ${weakWidth == 0 ? "rounded-l-md" : ""} bg-sky-700 h-8 text-center ${oldWidth == 0 ? "rounded-r-md" : ""} text-xs justify-center items-center text-white font-nunito font-bold`}
								style={{ width: `${reusedWidth}%` }}
							>
								Reused
							</div>
						) : null}
						{oldWidth != 0 ? (
							<div
								className={`flex p-2 ${reusedWidth == 0 || weakWidth == 0 ? "rounded-l-md" : ""} bg-purple-500 rounded-r-md h-8 text-center text-xs justify-center items-center text-white font-nunito font-bold`}
								style={{ width: `${oldWidth}%` }}
							>
								Old
							</div>
						) : null}
						{oldWidth == 0 && reusedWidth == 0 && weakWidth == 0 ? (
							<div
								className="flex p-2 bg-neutral-200 rounded-r-md rounded-l-md h-8 text-center text-xs justify-center items-center text-black font-nunito font-bold"
								style={{ width: "100%" }}
							>
								No Stats Available
							</div>
						) : null}
					</div>
				</div>
				<div className="analysis-container text-center flex justify-evenly  w-full">
					<div>
						<div className="flex">
							<img src={redinfo} alt="info-icon" className="w-4" />
							<p className="text-sm font-nunito font-bold p-1 dark:text-darktext-999">
								{totalWeakPasswords} Weak Passwords
							</p>
						</div>
						<p className="text-xs font-nunito  dark:text-darksubtext-999">
							You should change this
						</p>
					</div>
					<div>
						<div className="flex">
							<img src={blueinfo} alt="info-icon" className="w-4 mt-0 " />
							<p className="text-sm font-nunito font-bold p-1 dark:text-darktext-999">
								{totalReusedPasswords} Reused Passwords
							</p>
						</div>
						<p className="text-xs font-nunito  dark:text-darksubtext-999">
							Create unique password
						</p>
					</div>
					<div>
						<div className="flex">
							<img src={purpleinfo} alt="info-icon" className="w-4" />
							<p className="text-sm font-nunito font-bold p-1 dark:text-darktext-999">
								{totalOldPasswords} Old Passwords
							</p>
						</div>
						<p className="text-xs font-nunito  dark:text-darksubtext-999">
							Update your password
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Stats;
