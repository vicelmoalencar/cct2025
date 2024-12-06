import csv
import os
from datetime import datetime
from supabase import create_client, Client

# Configuração do Supabase (recomendo usar variáveis de ambiente para as chaves)
url = "https://jhhjeilyrgydnmamklbf.supabase.co"

supabase: Client = create_client(url, key)

def parse_date(date_str: str) -> str:
    """Converte string de data para formato ISO."""
    if not date_str:
        return None
    try:
        # Ajuste o formato conforme necessário
        date_obj = datetime.strptime(date_str.strip(), '%Y-%m-%d')
        return date_obj.isoformat()
    except ValueError:
        return None

def clean_cpf(cpf: str) -> str:
    """Remove caracteres especiais do CPF."""
    if not cpf:
        return None
    return ''.join(filter(str.isdigit, cpf.strip()))

def clean_phone(phone: str) -> str:
    """Remove caracteres especiais do telefone."""
    if not phone:
        return None
    return ''.join(filter(str.isdigit, phone.strip()))

def clean_key(key: str) -> str:
    """Remove espaços extras das chaves."""
    return key.strip()

def import_users(csv_path: str):
    """Importa usuários do CSV para o Supabase."""
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            # Limpa os espaços extras das chaves
            if reader.fieldnames:
                reader.fieldnames = [clean_key(key) for key in reader.fieldnames]
            
            for row in reader:
                # Limpa os valores
                clean_row = {k: v.strip() if v else v for k, v in row.items()}
                
                user_data = {
                    'id_bubble_user': clean_row.get('id_bubble_user'),
                    'nome': clean_row.get('nome'),
                    'first_name': clean_row.get('first_name'),
                    'last_name': clean_row.get('last_name'),
                    'email': clean_row.get('email', '').lower(),
                    'assinatura_ativa': clean_row.get('assinatura_ativa', '').lower() == 'true',
                    'ativo': clean_row.get('ativo', '').lower() == 'true',
                    'cpf': clean_cpf(clean_row.get('cpf')),
                    'dt_expiracao': parse_date(clean_row.get('dt_expiracao')),
                    'end_cep': clean_row.get('end_cep'),
                    'end_cidade': clean_row.get('end_cidade'),
                    'end_estado': clean_row.get('end_estado'),
                    'end_logradouro': clean_row.get('end_logradouro'),
                    'end_numero': clean_row.get('end_numero'),
                    'foto': clean_row.get('foto'),
                    'id_bubble_plano_atual': clean_row.get('id_bubble_plano_atual'),
                    'senha_provisoria': clean_row.get('senha_provisoria'),
                    'suporte': clean_row.get('suporte', '').lower() == 'true',
                    'telefone': clean_phone(clean_row.get('telefone')),
                    'teste_gratis': clean_row.get('teste_gratis', '').lower() == 'true',
                    'tipo': 'aluno',  # valor padrão
                    'whatsapp': clean_phone(clean_row.get('whatsapp')),
                    'whatsapp_validacao': clean_row.get('whatsapp_validacao', '').lower() == 'true'
                }
                
                try:
                    data, error = supabase.table('users').insert(user_data).execute()
                    if error:
                        print(f"Erro ao importar usuário {clean_row.get('email', 'desconhecido')}: {error}")
                    else:
                        print(f"Usuário {clean_row.get('email', 'desconhecido')} importado com sucesso!")
                except Exception as e:
                    print(f"Erro inesperado ao importar usuário {clean_row.get('email', 'desconhecido')}: {e}")
    except FileNotFoundError:
        print(f"Arquivo não encontrado: {csv_path}")
    except Exception as e:
        print(f"Erro inesperado ao abrir o arquivo: {e}")

if __name__ == "__main__":
    csv_path = r"C:\Users\55849\Downloads\importar.csv"  # Corrigido para usar string raw
    import_users(csv_path)
