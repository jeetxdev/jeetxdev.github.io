import PropTypes from "prop-types";
import linkedInWhite from "/InBug-White.png";
import linkedInBlack from "/InBug-Black.png";
import clsx from "clsx";
export default function LinkedInIcon({ className }) {
  return (
    <>
      <img
        src={linkedInWhite}
        alt="LinkedIn"
        className={clsx(className, "hidden")}
      />
      <img src={linkedInBlack} alt="LinkedIn" className={clsx(className)} />
    </>
  );
}
LinkedInIcon.propTypes = {
  className: PropTypes.string,
};
