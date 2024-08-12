import Link from "next/link";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const LinkButton = ({ href, children, ...props }) => (
  <Link href={href} passHref>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      size="large"
      {...props}
    >
      {children}
    </Button>
  </Link>
);

export default LinkButton;
