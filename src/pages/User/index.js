import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    Loading,
} from './styles';

function wait(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export default function User({ route, navigation }) {
    const [stars, setStars] = useState([]);
    const { user } = route.params;
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, [refreshing]);

    useEffect(() => {
        async function getUserData() {
            setLoading(true);

            const response = await api.get(`/users/${user.login}/starred`);

            setStars(response.data);
            setLoading(false);
        }

        getUserData();
    }, []);

    function handleNavigate(repository) {
        navigation.navigate('Repository', { repository });
    }

    return (
        <Container loading={loading}>
            <Header>
                <Avatar source={{ uri: user.avatar }} />
                <Name>{user.name}</Name>
                <Bio>{user.bio}</Bio>
            </Header>

            {loading ? (
                <Loading />
            ) : (
                <Stars
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    loading={loading}
                    data={stars}
                    keyExtractor={(star) => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred onPress={() => handleNavigate(item)}>
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                />
            )}
        </Container>
    );
}

User.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            user: PropTypes.shape({
                login: PropTypes.string,
                avatar: PropTypes.string,
                name: PropTypes.string,
                bio: PropTypes.string,
            }),
        }),
    }).isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }).isRequired,
};
