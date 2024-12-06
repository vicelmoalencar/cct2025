import os
import csv
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do cliente Supabase
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def processar_aulas_assistidas(csv_file_path):
    try:
        # Abre o arquivo CSV com delimitador correto
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            # Lê o CSV com delimitador ponto e vírgula (;)
            reader = csv.DictReader(file, delimiter=';')

            # Verifique as colunas identificadas pelo CSV
            print("Colunas identificadas no CSV:", reader.fieldnames)

            # Processa cada linha do CSV
            for row in reader:
                # Limpa os campos e remove colunas extras
                row = {key.strip(): value.strip() for key, value in row.items() if key and value}

                # Verifica se as colunas esperadas estão presentes
                if 'id_aula_bubble' not in row or 'usuarios' not in row:
                    print(f"Colunas ausentes na linha: {row}")
                    continue

                # Obtém os campos necessários
                id_aula_bubble = row.get('id_aula_bubble')
                usuarios = row.get('usuarios')

                # Ignorar linhas onde `usuarios` está vazio ou `id_aula_bubble` ausente
                if not id_aula_bubble or not usuarios:
                    print(f"Aviso: Linha ignorada devido a valores ausentes: {row}")
                    continue

                # Divide os usuários por vírgula e remove valores vazios
                usuarios_list = [user.strip() for user in usuarios.split(',') if user.strip()]

                # Ignorar linhas onde não há usuários válidos
                if not usuarios_list:
                    print(f"Aviso: Nenhum usuário válido na linha: {row}")
                    continue

                # Busca o id_aula na tabela aulas
                aula_response = supabase.table('aulas')\
                    .select('id_aula')\
                    .eq('id_bubble_aula', id_aula_bubble)\
                    .execute()

                if not aula_response.data:
                    print(f"Nenhuma aula encontrada para id_aula_bubble {id_aula_bubble}")
                    continue

                id_aula = aula_response.data[0]['id_aula']

                for id_bubble_usuario in usuarios_list:
                    # Busca o id_usuario na tabela usuarios
                    usuario_response = supabase.table('usuarios')\
                        .select('id_usuario')\
                        .eq('id_bubble_usuario', id_bubble_usuario)\
                        .execute()

                    if not usuario_response.data:
                        print(f"Nenhum usuário encontrado para id_bubble_usuario {id_bubble_usuario}")
                        continue

                    id_usuario = usuario_response.data[0]['id_usuario']

                    # Insere a linha na tabela aulas_assistidas
                    insert_response = supabase.table('aulas_assistidas').insert({
                        'id_aula': id_aula,
                        'id_usuario': id_usuario
                    }).execute()

                    if insert_response.data:
                        print(f"Linha inserida com sucesso: Aula {id_aula}, Usuário {id_usuario}")
                    else:
                        print(f"Erro ao inserir: Aula {id_aula}, Usuário {id_usuario}")

        print("\nProcessamento concluído!")

    except Exception as e:
        print(f"Erro durante a execução: {str(e)}")

if __name__ == "__main__":
    # Caminho para o arquivo CSV
    csv_file_path = 'C:/Users/55849/OneDrive/Documentos/cct2025/project/scripts/aulas_assistidas.csv'
    processar_aulas_assistidas(csv_file_path)
