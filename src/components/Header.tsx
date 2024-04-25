interface Props {
  setPage: (page: string) => void;
}

function Header(props: Props) {
  return (
    <header>
      <button onClick={() => props.setPage("start")}>Start</button>
      <button onClick={() => props.setPage("about")}>About</button>
      <button onClick={() => props.setPage("contacts")}>Contacts</button>
      <button onClick={() => props.setPage("booking")}>Booking</button>
      <button onClick={() => props.setPage("admin")}>Admin</button>
    </header>
  );
}

export default Header;
