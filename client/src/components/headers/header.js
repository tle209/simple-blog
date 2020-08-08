import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import PostModal from '../modals/postModal';
import Context from '../../utils/context';

const Header = () => {
    const context = useContext(Context);
    const [state, setState] = useState({
        modalShow: false,
        type: '',
    });

    const history = useHistory();

    const handleLogin = () => {
        history.push('/login');
    };

    return (
        <div className="container mt-5">
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Simple Blog</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="primary" onClick={() => setState({ ...state, modalShow: true, type: 'create' })}>Create Article</Button>
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        {!context.authState
                            ? <Button variant="primary" onClick={() => handleLogin()}>Login</Button>
                            : <Button variant="primary" onClick={() => handleLogin()}>Logout</Button>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {
                state.type === 'create'
                    ? <PostModal
                        modalShow={state.modalShow}
                        onHide={() => setState({ ...state, modalShow: false })}
                        type={state.type}
                        post={null}
                        articleTrackChange={null}/>
                    : ''
            }
        </div>
    );
};

export default Header;
