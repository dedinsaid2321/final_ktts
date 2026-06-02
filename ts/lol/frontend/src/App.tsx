import React, { useState, useEffect } from 'react';
import apiService from './api';
import { IUser } from './types';
import './App.css';

const App: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [users, setUsers] = useState<IUser[]>([]);


  const [signName, setSignName] = useState<string>('');
  const [checkName, setCheckName] = useState<string>('');
  const [createName, setCreateName] = useState<string>('');
  const [createSurname, setCreateSurname] = useState<string>('');
  const [petId, setPetId] = useState<string>('');
  const [petName, setPetName] = useState<string>('');
  const [colorsId, setColorsId] = useState<string>('');
  const [colorsInput, setColorsInput] = useState<string>('');

  const handleApiCall = async (
    apiCall: () => Promise<any>,
    successMessage: string
  ) => {
    setError('');
    setResponse('');
    try {
      const result = await apiCall();
      if (result.success) {
        setResponse(successMessage + '\n' + JSON.stringify(result.data, null, 2));
      } else {
        setError(result.error || 'Произошла ошибка');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при выполнении запроса');
    }
  };

  const loadUsers = async () => {
    const allUsers = await apiService.getAllUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSign = () => {
    if (!signName.trim()) {
      setError('Введите имя');
      return;
    }
    handleApiCall(
      () => apiService.sign(signName),
      'Регистрация успешна!'
    ).then(() => loadUsers());
  };

  const handleCheck = () => {
    if (!checkName.trim()) {
      setError('Введите имя');
      return;
    }
    handleApiCall(
      () => apiService.check(checkName),
      'Проверка выполнена'
    ).then(() => loadUsers());
  };

  const handleCreate = () => {
    if (!createName.trim() || !createSurname.trim()) {
      setError('Введите имя и фамилию');
      return;
    }
    handleApiCall(
      () => apiService.create(createName, createSurname),
      'Создание/обновление выполнено'
    ).then(() => loadUsers());
  };

  const handleAddPet = () => {
    const id = parseInt(petId);
    if (isNaN(id) || !petName.trim()) {
      setError('Введите корректный ID и название животного');
      return;
    }
    handleApiCall(
      () => apiService.addPet(id, petName),
      'Питомец добавлен'
    ).then(() => loadUsers());
  };

  const handleAddColors = () => {
    const id = parseInt(colorsId);
    if (isNaN(id) || !colorsInput.trim()) {
      setError('Введите корректный ID и цвета');
      return;
    }
    const colorsArray = colorsInput.split(',').map(c => c.trim()).filter(c => c);
    if (colorsArray.length === 0) {
      setError('Введите хотя бы один цвет');
      return;
    }
    handleApiCall(
      () => apiService.addColors(id, colorsArray),
      'Цвета добавлены'
    ).then(() => loadUsers());
  };

  return (
    <div className="app">
      <h1>Управление пользователями</h1>
      
      <div className="users-list">
        <h2>Текущие пользователи в системе:</h2>
        {users.length === 0 ? (
          <p>Нет пользователей</p>
        ) : (
          <div className="users-grid">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <h3>#{user.id} {user.name} {user.surname || ''}</h3>
                <div><strong>Питомцы:</strong> {user.pets.length ? user.pets.join(', ') : 'нет'}</div>
                <div><strong>Цвета:</strong> {user.colors.length ? user.colors.join(', ') : 'нет'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="buttons-container">
        <div className="button-group">
          <h3>1.Регистрация имени</h3>
          <input
            type="text"
            placeholder="Имя"
            value={signName}
            onChange={(e) => setSignName(e.target.value)}
          />
          <button onClick={handleSign}>Зарегистрироваться</button>
        </div>

        <div className="button-group">
          <h3>2.Проверка имени</h3>
          <input
            type="text"
            placeholder="Имя"
            value={checkName}
            onChange={(e) => setCheckName(e.target.value)}
          />
          <button onClick={handleCheck}>Проверить</button>
        </div>

        <div className="button-group">
          <h3>3.Создать пользователя</h3>
          <input
            type="text"
            placeholder="Имя"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={createSurname}
            onChange={(e) => setCreateSurname(e.target.value)}
          />
          <button onClick={handleCreate}>Создать</button>
        </div>

        <div className="button-group">
          <h3>4.Добавить питомца</h3>
          <input
            type="number"
            placeholder="ID пользователя"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Название животного"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
          <button onClick={handleAddPet}>Добавить питомца</button>
        </div>

        <div className="button-group">
          <h3>5.Добавить цвета</h3>
          <input
            type="number"
            placeholder="ID пользователя"
            value={colorsId}
            onChange={(e) => setColorsId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Цвета (через запятую)"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
          />
          <button onClick={handleAddColors}>Добавить цвета</button>
        </div>
      </div>

      {error && (
        <div className="error">
          <h3>Ошибка:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;