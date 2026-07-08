"""create decisions table

Revision ID: a2d74f48c91e
Revises: f1e49a7c2a6b
Create Date: 2026-07-08 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a2d74f48c91e"
down_revision: Union[str, Sequence[str], None] = "f1e49a7c2a6b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "decisions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("context", sa.Text(), nullable=False),
        sa.Column("decision", sa.Text(), nullable=False),
        sa.Column("alternatives", sa.Text(), nullable=True),
        sa.Column("consequences", sa.Text(), nullable=True),
        sa.Column("ai_draft", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_decisions_id"), "decisions", ["id"], unique=False)
    op.create_index(
        op.f("ix_decisions_project_id"),
        "decisions",
        ["project_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_decisions_project_id"), table_name="decisions")
    op.drop_index(op.f("ix_decisions_id"), table_name="decisions")
    op.drop_table("decisions")
