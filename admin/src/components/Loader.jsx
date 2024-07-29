import * as React from 'react'
import LoadingBar from 'react-top-loading-bar'

const Loder = ({ loading }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (loading) {
            ref.current.continuousStart();
        } else {
            ref.current.complete();
        }
    }, [loading]);

    return <LoadingBar height={5} color="blue" ref={ref} />;
};

export default Loder;
