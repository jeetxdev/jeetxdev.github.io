import githubBlack from "/github-mark.svg";
import githubWhite from "/github-mark-white.svg";
import clsx from "clsx";
import PropTypes from "prop-types";
export default function GithubIcon({ className }) {
  return (
    <>
      <img
        src={githubBlack}
        alt="Github Light"
        className={clsx("dark:hidden", className)}
      />
      <img
        src={githubWhite}
        alt="Github Dark"
        className={clsx("hidden", "dark:block", className)}
      />
    </>
  );
}

GithubIcon.propTypes = {
  className: PropTypes.string,
};
